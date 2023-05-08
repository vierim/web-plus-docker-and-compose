import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WishesService } from '../wishes/wishes.service';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';

import { WishNotFoundException } from '../wishes/exceptions';
import { WishlistNotFoundException } from './exceptions';
import { WrongOwnerException } from './exceptions/wrong-owner.exception';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async create(user: User, payload: CreateWishlistDto): Promise<Wishlist> {
    const { name, description, image, itemsId } = payload;

    const wishes = await this.wishesService.findManyWishes(itemsId);

    if (wishes.length === 0) {
      throw new WishNotFoundException();
    }

    const wishList = await this.wishlistRepository.save({
      name,
      description,
      image,
      owner: user,
      items: [...wishes],
    });

    return wishList;
  }

  async findAll(): Promise<Wishlist[]> {
    const wishlists = await this.wishlistRepository.find({
      relations: {
        owner: true,
      },
    });

    return wishlists;
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      relations: {
        owner: true,
        items: true,
      },
      where: {
        id,
      },
    });

    if (!wishlist) {
      throw new WishlistNotFoundException();
    }

    return wishlist;
  }

  async updateOne(
    id: number,
    user: User,
    payload: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const { name, description, image, itemsId } = payload;

    const wishlist = await this.findOne(id);
    if (!wishlist) {
      throw new WishlistNotFoundException();
    }
    if (wishlist.owner.id !== user.id) {
      throw new WrongOwnerException();
    }

    const wishes = await this.wishesService.findManyWishes(itemsId);
    if (wishes.length === 0) {
      throw new WishNotFoundException();
    }

    await this.wishlistRepository.save({
      id,
      name,
      description,
      image,
      owner: user,
      items: [...wishes],
    });

    return await this.findOne(id);
  }

  async removeOne(id: number, user: User): Promise<Wishlist> {
    const wishlist = await this.findOne(id);

    if (!wishlist) {
      throw new WishNotFoundException();
    }

    if (wishlist.owner.id !== user.id) {
      throw new WrongOwnerException();
    }

    await this.wishlistRepository.delete(id);

    return wishlist;
  }
}
