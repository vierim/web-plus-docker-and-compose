import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

import {
  AmountExceedException,
  OfferNotFoundException,
  OwnInstanceException,
} from './exceptions';
import { WishNotFoundException } from '../wishes/exceptions';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async createOne(user: User, payload: CreateOfferDto) {
    const { itemId, amount, hidden } = payload;

    const wish = await this.wishesService.findOne(itemId);

    if (!wish) {
      throw new WishNotFoundException();
    }

    const newAmount = wish.raised + amount;

    if (newAmount > wish.price) {
      throw new AmountExceedException();
    }

    if (user.id === wish.owner.id) {
      throw new OwnInstanceException();
    }

    await this.wishesService.raiseAmount(itemId, newAmount);
    await this.offerRepository.save({
      amount,
      hidden,
      user,
      item: wish,
    });

    return {};
  }

  async findOne(id: number) {
    const offer = await this.offerRepository.findOne({
      relations: [
        'item',
        'item.owner',
        'user',
        'user.wishes',
        'user.wishes.owner',
        'user.offers',
      ],
      where: {
        id,
      },
    });

    if (!offer) {
      throw new OfferNotFoundException();
    }

    return offer;
  }

  async findMany(userId: number) {
    const offers = await this.offerRepository.find({
      relations: [
        'item',
        'item.owner',
        'user',
        'user.wishes',
        'user.wishes.owner',
        'user.offers',
      ],
      where: {
        user: {
          id: userId,
        },
      },
    });

    return offers;
  }
}
