import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { HashService } from '../hash/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, User])],
  controllers: [WishesController],
  providers: [WishesService, UsersService, HashService],
  exports: [WishesService],
})
export class WishesModule {}
