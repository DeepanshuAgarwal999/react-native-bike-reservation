import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { UserRole } from 'src/constants';
import { Bike } from 'src/bike/entities/bike.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  @IsBoolean()
  isManager: boolean;

  @OneToMany(() => Bike, (bike) => bike.owner)
  bikes: Bike[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];
}
