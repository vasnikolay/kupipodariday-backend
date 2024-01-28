import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { UserPasswordInterceptor } from '../interceptors/user-password.interceptor';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @UseInterceptors(UserPasswordInterceptor)
  @Post()
  async createOffer(
    @Req() { user }: Request & { user: User },
    @Body() createOfferDto: CreateOfferDto,
  ) {
    return await this.offersService.createOffer(user, createOfferDto);
  }
}
