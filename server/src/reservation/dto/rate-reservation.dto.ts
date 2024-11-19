// dto/rate-reservation.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export class RateReservationDto {
  @IsNotEmpty()
  @IsNumber()
  reservationId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Max(5)
  @Min(1)
  rating: number;
}
