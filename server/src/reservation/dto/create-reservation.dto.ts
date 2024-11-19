import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateReservationDto {

  @IsNotEmpty()
  bikeId: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}
