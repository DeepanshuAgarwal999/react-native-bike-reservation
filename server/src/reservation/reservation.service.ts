import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import {
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { Bike } from 'src/bike/entities/bike.entity';
import { Reservation } from './entities/reservation.entity';
import { RateReservationDto } from './dto/rate-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Bike) private readonly bikeRepository: Repository<Bike>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: number) {
    const { bikeId, startDate, endDate } = createReservationDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const bike = await this.bikeRepository.findOne({ where: { id: bikeId } });
    if (!bike) {
      throw new NotFoundException('Bike not found');
    }
    if (!bike.isAvailable) {
      throw new ConflictException('Bike not Available');
    }

    const currentDate = new Date();
    if (
      new Date(startDate) <= currentDate ||
      new Date(endDate) <= currentDate
    ) {
      throw new ConflictException(
        'Both start and end dates must be in the future.',
      );
    }

    const existingReservation = await this.reservationRepository.findOne({
      where: [
        {
          bike: { id: bikeId },
          startDate: LessThanOrEqual(endDate),
          endDate: MoreThanOrEqual(startDate),
        },
      ],
    });
    if (existingReservation) {
      if (existingReservation.disabled) {
        existingReservation.disabled = false;
        await this.reservationRepository.save(existingReservation);
      } else {
        throw new ConflictException(
          'Selected dates are already booked. Please choose new dates.',
        );
      }
    }
    const reservation = this.reservationRepository.create({
      user,
      bike,
      startDate,
      endDate,
    });

    return this.reservationRepository.save(reservation);
  }

  async findAllByUserId(userId: number): Promise<Reservation[]> {
    const reservation = await this.reservationRepository.find({
      where: { user: { id: +userId } },
      relations: ['user', 'bike'],
      select: {
        id: true,
        startDate: true,
        endDate: true,
        disabled: true,
        rating: true,
        user: {
          id: true,
          name: true,
          email: true,
        },
        bike: {
          id: true,
          model: true,
          color: true,
          avgRating: true,
          isAvailable: true,
          imageURL: true,
        },
      },
    });

    if (!reservation) {
      throw new NotFoundException(
        'No reservation found for the give id' + userId,
      );
    }
    return reservation;
  }

  async findAll() {
    return await this.reservationRepository.find({
      relations: ['user', 'bike'],
      select: {
        id: true,
        startDate: true,
        endDate: true,
        disabled: true,
        rating: true,
        user: {
          id: true,
          name: true,
          email: true,
        },
        bike: {
          id: true,
          model: true,
          color: true,
          avgRating: true,
          isAvailable: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: id },
    });
    if (!reservation) {
      throw new NotFoundException('No reservation found for the give id' + id);
    }
    return reservation;
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    const reservation = await this.reservationRepository.preload({
      id,
      ...updateReservationDto,
    });

    if (!reservation) {
      throw new NotFoundException('No reservation found!');
    }
    try {
      const updatedReservation =
        await this.reservationRepository.save(reservation);
      if (!updatedReservation) {
        throw new InternalServerErrorException(
          'Reservation not saved correctly',
        );
      }
      return updatedReservation;
    } catch (error) {
      throw new InternalServerErrorException('Unable to update reservation');
    }
  }

  async remove(id: number) {
    const result = await this.reservationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('No reservation found!');
    }
    return {
      message: 'Successfully deleted',
    };
  }

  async cancelReservation(id: number, userId: number) {
     if (isNaN(id)) {
       throw new ConflictException('Invalid reservation ID');
     }
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!reservation) {
      throw new NotFoundException(`No reservation found with ID ${id}!`);
    }

    if (reservation.user.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to cancel this reservation.',
      );
    }
    reservation.disabled = true;

    try {
      const updatedReservation =
        await this.reservationRepository.save(reservation);

      if (!updatedReservation) {
        throw new InternalServerErrorException(
          'Reservation could not be saved correctly after cancellation.',
        );
      }

      return updatedReservation;
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw new InternalServerErrorException('Unable to update reservation.');
    }
  }

  async rateReservation(
    userId: number,
    rateReservationDto: RateReservationDto,
  ): Promise<Reservation> {
    try {
      const { reservationId, rating } = rateReservationDto;
      console.log(reservationId + ' ' + rating);
      const reservation = await this.reservationRepository.findOne({
        where: { id: +reservationId },
        relations: ['user', 'bike'],
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.user.id !== userId) {
        throw new ForbiddenException(
          'You are not allowed to rate this reservation',
        );
      }

      if (reservation.disabled) {
        throw new ForbiddenException(
          'This reservation has been already disabled',
        );
      }

      if (reservation.rating) {
        throw new ForbiddenException('This reservation has already been rated');
      }

      reservation.rating = +rating;
      return await reservation.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllReservations(userId: number) {
    const reservations = await this.reservationRepository.find({
      where: { user: { id: userId } },
      relations: ['bike', 'user'],
      select: {
        id: true,
        startDate: true,
        endDate: true,
        disabled: true,
        rating: true,
        user: {
          id: true,
          name: true,
          email: true,
        },
        bike: {
          id: true,
          model: true,
          color: true,
          avgRating: true,
          isAvailable: true,
        },
      },
    });

    if (!reservations.length) {
      throw new NotFoundException('No reservations found for this user');
    }

    return reservations;
  }
}
