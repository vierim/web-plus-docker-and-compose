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
import { WishlistsService } from './wishlists.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

import type { TAdvancedRequest } from '../types';

@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Post()
  createOne(
    @Request() req: TAdvancedRequest,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistsService.create(req.user, createWishlistDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: number,
    @Request() req: TAdvancedRequest,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.updateOne(id, req.user, updateWishlistDto);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number, @Request() req: TAdvancedRequest) {
    return this.wishlistsService.removeOne(id, req.user);
  }
}
