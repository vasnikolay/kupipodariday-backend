import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { UserPasswordInterceptor } from '../interceptors/user-password.interceptor';
import { OwnerPasswordInterceptor } from '../interceptors/owner-password.interceptor';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseInterceptors(OwnerPasswordInterceptor)
  @UseGuards(JwtGuard)
  @Post()
  createWish(
    @Body() createWishDto: CreateWishDto,
    @Req() req: Request & { user: User },
  ) {
    return this.wishesService.createWish(createWishDto, req.user);
  }

  @Get('last')
  async getLastWishes() {
    return await this.wishesService.getLastWishes();
  }

  @Get('top')
  async getTopWishes() {
    return await this.wishesService.getTopWishes();
  }

  @Get(':id')
  async getWishById(@Param('id') id: number) {
    return await this.wishesService.getWishById(id);
  }

  @UseInterceptors(UserPasswordInterceptor)
  @UseGuards(JwtGuard)
  @Patch(':id')
  updateWish(
    @Req() { user }: Request & { user: User },
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateWish(user.id, id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Req() { user: { id } }, @Param(':id') wishId: number) {
    return await this.wishesService.copyWish(id, wishId);
  }
  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteWish(
    @Req() { user }: Request & { user: User },
    @Param('id') id: number,
  ) {
    return this.wishesService.deleteWish(user.id, id);
  }
}
