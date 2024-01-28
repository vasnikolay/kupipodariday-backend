import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { DataSource, Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private readonly dataSource: DataSource,
    private readonly wishesService: WishesService,
  ) {}
  async createOffer(user: User, createOfferDto: CreateOfferDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wish = await this.wishesService.getWishById(createOfferDto.itemId);
      if (user.id === wish.owner.id) {
        throw new BadRequestException('You cannot offer your own wish');
      }

      const raisedSum = Number(
        (wish.raised + createOfferDto.amount).toFixed(2),
      );

      if (raisedSum > wish.price) {
        throw new BadRequestException('Offer amount exceeds wish price');
      }

      await this.wishesService.updateRaised(createOfferDto.itemId, {
        raised: raisedSum,
      });

      console.log('createOfferDto', createOfferDto);
      console.log('wish', wish);
      console.log('user', user);

      // const offer = await this.offersRepository.save({
      //   ...createOfferDto,
      //   wish,
      //   user,
      // });
      await queryRunner.commitTransaction();
      // return offer;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
