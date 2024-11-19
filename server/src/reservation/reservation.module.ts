import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { User } from 'src/user/entities/user.entity';
import { Bike } from 'src/bike/entities/bike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, User, Bike])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
