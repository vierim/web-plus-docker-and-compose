import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

import { LocalAuthGuard } from './guards/local-auth.guard';

import { CreateUserDto } from '../users/dto/create-user.dto';

import { UserAlreadyExistsException } from '../users/exceptions';
import { UserAlreadyExistsExceptionFilter } from '../filters/user-exist.filter';

import { User } from '../users/entities/user.entity';
import type { TSigninResponse, TAdvancedRequest } from '../types';

@Controller()
@UseFilters(UserAlreadyExistsExceptionFilter)
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() payload: CreateUserDto): Promise<User> {
    const { username, email } = payload;

    if (await this.userService.isUserExist(username, email)) {
      throw new UserAlreadyExistsException();
    }

    await this.userService.create(payload);

    return await this.userService.find({ username });
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req: TAdvancedRequest): Promise<TSigninResponse> {
    return this.authService.signin(req.user);
  }
}
