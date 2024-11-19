import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Bike extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  model: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  color: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  location: string;

  @Column()
  @IsBoolean()
  @IsNotEmpty()
  isAvailable: boolean;

  @Column({
    default: 1,
  })
  @IsNumber()
  @IsPositive()
  avgRating: number;

  @Column({
    default: '',
  })
  @IsOptional()
  @IsString()
  imageURL: string;

  @ManyToOne(() => User, (user) => user.bikes)
  owner: User;

  @OneToMany(() => Reservation, (reservation) => reservation.bike)
  reservations: Reservation[];
}
