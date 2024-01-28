import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { DataSource, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly dataSource: DataSource,
    private readonly wishesService: WishesService,
  ) {}

  async findAllWishlists(): Promise<Wishlist[]> {
    return await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findWishlistById(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return wishlist;
  }

  async removeWishlistById(userId: number, wishListId: number) {
    const wishlist = await this.findWishlistById(wishListId);

    if (userId !== wishlist.owner.id) {
      throw new BadRequestException('You are not the owner of this wishlist');
    }

    return await this.wishlistsRepository.delete(wishListId);
  }

  async createWishlist(
    owner: User,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { itemsId, ...wishlistWithoutItems } = createWishlistDto;
      const wishes = await Promise.all(
        itemsId.map((id) => this.wishesService.getWishById(id)),
      );

      const wishList = await this.wishlistsRepository.save({
        ...wishlistWithoutItems,
        items: wishes,
        owner,
      });
      await queryRunner.commitTransaction();

      return wishList;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
