import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { User } from './entities/user.entity';

import type { TAdvancedRequest } from '../types';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Request() req: TAdvancedRequest): Promise<User> {
    const { username } = req.user;

    return this.usersService.find({ username });
  }

  @Patch('me')
  updateOne(@Request() req: TAdvancedRequest, @Body() payload: UpdateUserDto) {
    return this.usersService.updateOne(req.user.id, payload);
  }

  @Get('me/wishes')
  findWishes(@Request() req: TAdvancedRequest) {
    return this.usersService.findUserWishes(req.user.id);
  }

  @Get(':username')
  findUser(@Param('username') username: string) {
    return this.usersService.find({ username });
  }

  @Get(':username/wishes')
  findUserWishes(@Param('username') username: string) {
    return this.usersService.findUserWishes(username);
  }

  @Post('find')
  findMany(@Body('query') query: string) {
    return this.usersService.findMany(query);
  }
}
