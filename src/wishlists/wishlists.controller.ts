import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { UserPasswordInterceptor } from '../interceptors/user-password.interceptor';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAllWishlists() {
    return this.wishlistsService.findAllWishlists();
  }

  @Get(':id')
  findWishlistById(@Param('id') id: number) {
    return this.wishlistsService.findWishlistById(id);
  }

  @Delete(':id')
  removeWishlistById(
    @Req() { user }: Request & { user: User },
    @Param('id') id: number,
  ) {
    return this.wishlistsService.removeWishlistById(user.id, id);
  }

  @UseInterceptors(UserPasswordInterceptor)
  @Post()
  createWishlist(
    @Req() { user }: Request & { user: User },
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistsService.createWishlist(user, createWishlistDto);
  }
}
