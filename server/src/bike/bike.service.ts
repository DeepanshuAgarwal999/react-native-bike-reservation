import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bike } from './entities/bike.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BikeService {
  constructor(
    @InjectRepository(Bike) private readonly bikeRepository: Repository<Bike>,
  ) {}
  async create(createBikeDto: CreateBikeDto) {
    try {
      const bike = this.bikeRepository.create(createBikeDto);
      console.log(bike);
      return await this.bikeRepository.save(bike);
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(
    filters: {
      model?: string;
      color?: string;
      location?: string;
      startDate?: Date;
      endDate?: Date;
      avgRating?: number;
      isAvailable?: boolean;
    },
    page: number = 1,
    limit: number = 5,
  ) {
    try {
      const query = this.bikeRepository.createQueryBuilder('bike');
      if (filters.model) {
        query.andWhere('bike.model = :model', { model: filters.model });
      }

      if (filters.color) {
        query.andWhere('bike.color = :color', { color: filters.color });
      }
      if (filters.location) {
        query.andWhere('bike.location = :location', {
          location: filters.location,
        });
      }
      if (filters.isAvailable !== undefined) {
        const available = Boolean(filters.isAvailable);
        query.andWhere('bike.isAvailable = :isAvailable', {
          isAvailable: available,
        });
      }
      if (filters.avgRating && !isNaN(filters.avgRating)) {
        query.andWhere('bike.avgRating >= :avgRating', {
          avgRating: +filters.avgRating,
        });
      }

      if (filters.startDate && filters.endDate) {
        const { startDate, endDate } = filters;

        query
          .leftJoin('bike.reservations', 'reservation')
          .andWhere(
            'bike.id NOT IN (SELECT r.bikeId FROM reservation r WHERE r.startDate < :endDate AND r.endDate > :startDate)',
            {
              startDate,
              endDate,
            },
          );
      }

      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 5;
      const skip = (pageNum - 1) * limitNum;

      query.skip(skip).take(limitNum);

      const [data, total] = await query.getManyAndCount();

      return {
        data,
        total,
        page: pageNum,
        pageCount: Math.ceil(total / Number(limitNum)),
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Unable to create filtered query' + error,
      );
    }
  }

  async findOne(id: number) {
    return await this.bikeRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateBikeDto: UpdateBikeDto) {
    const isUpdated = await this.bikeRepository.update(id, updateBikeDto);
    if (isUpdated.affected === 1) {
      return await this.bikeRepository.findOne({ where: { id: id } });
    } else {
      throw new NotAcceptableException('Unable to update');
    }
  }

  async remove(id: number) {
    const isDeleted = await this.bikeRepository.delete(id);
    if (!isDeleted) {
      throw new NotFoundException('bike not found');
    }
    return isDeleted;
  }
}
