import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Bike } from 'src/bike/entities/bike.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Bike, (bike) => bike.reservations, { onDelete: 'CASCADE' })
  bike: Bike;

  @Column({ nullable: true })
  @IsNumber()
  @IsPositive()
  @Max(5)
  @Min(1)
  rating?: number;

  @Column({
    default: false,
  })
  @IsBoolean()
  disabled: boolean;

  @Column()
  @IsNotEmpty()
  @IsString()
  startDate: Date;

  @Column()
  @IsNotEmpty()
  @IsString()
  endDate: Date;
}
