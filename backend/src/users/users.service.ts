import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

import { WishesService } from '../wishes/wishes.service';

import {
  UserNotFoundException,
  UserAlreadyExistsException,
} from './exceptions';

import type { TUserSearchQuery } from '../types/queries';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private wishesService: WishesService,
  ) {}

  async create(payload: CreateUserDto): Promise<User> {
    const { username, email } = payload;

    if (await this.isUserExist(username, email)) {
      throw new UserAlreadyExistsException();
    }

    const hash = await bcrypt.hash(payload.password, 10);
    const user = await this.userRepository.save({
      ...payload,
      password: hash,
    });

    return user;
  }

  async updateOne(id: number, payload: UpdateUserDto): Promise<User> {
    const { username, email } = payload;
    if (username || email) {
      if (await this.isUserExist(username, email)) {
        throw new UserAlreadyExistsException();
      }
    }

    const data = { ...payload };
    if (payload.password) {
      const hash = await bcrypt.hash(payload.password, 10);
      data.password = hash;
    }

    await this.userRepository.update(id, data);
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }

  async find(
    query: TUserSearchQuery,
    rows: Record<string, boolean> = {},
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        ...query,
      },
      select: {
        ...rows,
      },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async findUserWishes(query: number | string): Promise<Wish[]> {
    if (typeof query === 'number') {
      return await this.wishesService.findMany(query);
    }

    if (typeof query === 'string') {
      const user = await this.find({ username: query });
      return await this.wishesService.findMany(user.id);
    }
  }

  async findMany(queryText: string) {
    const users = await this.userRepository.findBy([
      { username: Like(`%${queryText}%`) },
      { email: Like(`%${queryText}%`) },
    ]);

    return users;
  }

  async isUserExist(username: string, email: string) {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    return user ? true : false;
  }
}
