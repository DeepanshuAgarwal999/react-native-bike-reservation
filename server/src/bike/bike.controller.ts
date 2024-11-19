import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BikeService } from './bike.service';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@UseGuards(AuthGuard)
@Controller('bike')
export class BikeController {
  constructor(private readonly bikeService: BikeService) {}

  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createBikeDto: CreateBikeDto) {
    return this.bikeService.create(createBikeDto);
  }

  @Get()
  findAll(
    @Query('model') model?: string,
    @Query('color') color?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('avgRating') avgRating?: number,
    @Query('location') location?: string,
    @Query('isAvailable') isAvailable?: boolean,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    const filters = {
      model,
      color,
      avgRating,
      location,
      isAvailable,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    return this.bikeService.findAll(filters, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bikeService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBikeDto: UpdateBikeDto) {
    return this.bikeService.update(+id, updateBikeDto);
  }

  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bikeService.remove(+id);
  }
}
