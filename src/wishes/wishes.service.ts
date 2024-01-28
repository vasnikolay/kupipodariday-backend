import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly dataSource: DataSource,
  ) {}
  async createWish(createWishDto: CreateWishDto, owner: User): Promise<Wish> {
    return await this.wishRepository.save({ ...createWishDto, owner });
  }

  async getLastWishes(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 10,
      order: { createdAt: 'DESC' },
      relations: ['owner', 'offers'],
    });
  }

  async getTopWishes(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 10,
      order: { copied: 'DESC' },
      relations: ['owner', 'offers'],
    });
  }

  async getWishById(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    return wish;
  }

  async updateWish(
    userId: number,
    wishId: number,
    updateWishDto: UpdateWishDto,
  ): Promise<void> {
    const wish = await this.getWishById(wishId);
    if (userId !== wish.owner.id) {
      throw new BadRequestException('You are not the owner of this wish');
    }

    if (updateWishDto.hasOwnProperty('price') && wish.raised > 0) {
      throw new BadRequestException('Wish already raised');
    }

    const updatedWish = await this.wishRepository.update(wishId, updateWishDto);

    if (updatedWish.affected === 0) {
      throw new NotFoundException('Wish not found');
    }
  }

  async updateRaised(id: number, updateWishDto: UpdateWishDto): Promise<void> {
    const updatedWish = await this.wishRepository.update(id, updateWishDto);

    if (updatedWish.affected === 0) {
      throw new BadRequestException('update failed');
    }
  }

  async deleteWish(userId: number, wishId: number) {
    const wish = await this.getWishById(wishId);
    if (userId !== wish.owner?.id) {
      throw new BadRequestException('You are not the owner of this wish');
    }
    return await this.wishRepository.delete(wishId);
  }

  async copyWish(user: User, wishId: number): Promise<Wish> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, owner, ...wish } =
        await this.getWishById(wishId);
      const copiedWish = await this.createWish(wish, user);
      await this.wishRepository.update(wishId, {
        copied: copiedWish.copied + 1,
      });
      await queryRunner.commitTransaction();
      return copiedWish;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
