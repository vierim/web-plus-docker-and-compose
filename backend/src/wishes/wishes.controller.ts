import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';

import { WishesService } from './wishes.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

import type { TAdvancedRequest } from '../types';

@Controller('wishes')
@UseGuards(JwtAuthGuard)
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  createOne(
    @Request() req: TAdvancedRequest,
    @Body() createWishDto: CreateWishDto,
  ) {
    return this.wishesService.createOne(req.user, createWishDto);
  }

  @Get('last')
  findLastWishes() {
    return this.wishesService.findLastWishes();
  }

  @Get('top')
  findTopWishes() {
    return this.wishesService.findTopWishes();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: number,
    @Request() req: TAdvancedRequest,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateOne(id, req.user, updateWishDto);
  }

  @Delete(':id')
  removeOne(@Param('id') id: number, @Request() req: TAdvancedRequest) {
    return this.wishesService.removeOne(id, req.user);
  }

  @Post(':id/copy')
  copyOne(@Param('id') id: number, @Request() req: TAdvancedRequest) {
    return this.wishesService.copyOne(id, req.user);
  }
}
