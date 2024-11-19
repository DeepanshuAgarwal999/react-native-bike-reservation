import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class CreateBikeDto {
  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsBoolean()
  @IsNotEmpty()
  isAvailable: boolean;

  @IsOptional() 
  @IsNumber()
  @IsPositive()
  @Max(5)
  @Min(1)
  avgRating?: number;

  @IsOptional()
  @IsString()
  imageURL?: string;
}
