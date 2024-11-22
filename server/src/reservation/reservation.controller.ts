import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { RateReservationDto } from './dto/rate-reservation.dto';

@UseGuards(AuthGuard)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
    @Req() request: Request,
  ) {
    return this.reservationService.create(
      createReservationDto,
      request.user.id,
    );
  }
  @Get('/user/:id')
  findAllByUserId(@Param('id') id: string) {
    return this.reservationService.findAllByUserId(+id);
  }

  @Patch('/cancel-reservation/:id')
  cancelReservation(@Req() req: Request, @Param('id') id: string) {
    return this.reservationService.cancelReservation(+id, req.user.id);
  }

  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get('/user')
  getAllReservation(@Req() req: Request) {
    return this.reservationService.getAllReservations(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(+id, updateReservationDto);
  }

  @UseGuards(RolesGuard)
  @Delete()
  remove(@Req() req: Request) {
    return this.reservationService.remove(req.user.id);
  }

  @Post('/rate')
  async rateReservation(
    @Body() rateReservationDto: RateReservationDto,
    @Req() request: Request,
  ) {
    return this.reservationService.rateReservation(
      request.user.id,
      rateReservationDto,
    );
  }
}
