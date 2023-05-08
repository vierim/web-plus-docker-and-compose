import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';

import {
  WishNotFoundException,
  WishRaisedException,
  WrongOwnerException,
  CopyOwnWishException,
  WishAlreadyExistException,
} from './exceptions';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
  ) {}

  async createOne(user: User, payload: CreateWishDto) {
    await this.wishRepository.save({
      ...payload,
      owner: user,
    });

    return {};
  }

  async findManyWishes(idsList: number[]): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      where: {
        id: In([...idsList]),
      },
    });

    return wishes;
  }

  async findOne(id: number) {
    const wish = await this.wishRepository.findOne({
      relations: {
        owner: true,
        offers: true,
      },
      where: {
        id,
      },
    });

    return wish;
  }

  async updateOne(id: number, user: User, payload: UpdateWishDto) {
    const wish = await this.wishRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id,
      },
    });

    if (wish.raised > 0) {
      throw new WishRaisedException();
    }

    if (wish.owner.id !== user.id) {
      throw new WrongOwnerException();
    }

    await this.wishRepository.update(id, { ...payload });

    return {};
  }

  async findMany(userId: number) {
    const wishes = await this.wishRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      where: {
        owner: {
          id: userId,
        },
      },
    });

    return wishes;
  }

  async removeOne(id: number, user: User): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id,
      },
    });

    if (!wish) {
      throw new WishNotFoundException();
    }

    if (wish.owner.id !== user.id) {
      throw new WrongOwnerException();
    }

    await this.wishRepository.delete(id);

    return wish;
  }

  async findLastWishes(): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });

    return wishes;
  }

  async findTopWishes(): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        copied: 'DESC',
      },
      take: 20,
    });

    return wishes;
  }

  async raiseAmount(wishId: number, amount: number) {
    return await this.wishRepository.update({ id: wishId }, { raised: amount });
  }

  async copyOne(wishId: number, user: User): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: {
        id: wishId,
      },
      relations: {
        owner: true,
      },
    });

    const { id, name, link, image, price, description, copied } = wish;

    if (!wish) {
      throw new WishNotFoundException();
    }

    if (wish.owner.id === user.id) {
      throw new CopyOwnWishException();
    }

    const similarWishes = await this.hasSimilarWishes(
      user,
      name,
      link,
      price,
      description,
    );
    if (similarWishes.length) {
      throw new WishAlreadyExistException();
    }

    const newCopiesCount = copied + 1;
    await this.wishRepository.update(id, { copied: newCopiesCount });

    const newWish = await this.wishRepository.save({
      name,
      link,
      image,
      price,
      description,
      copied: 0,
      owner: user,
    });

    return newWish;
  }

  async hasSimilarWishes(
    user: User,
    name: string,
    link: string,
    price: number,
    description: string,
  ): Promise<Wish[]> {
    const wish = await this.wishRepository.find({
      relations: {
        owner: true,
      },
      where: {
        name,
        link,
        price,
        description,
        owner: {
          id: user.id,
        },
      },
    });

    return wish;
  }
}
