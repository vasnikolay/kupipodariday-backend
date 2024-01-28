import { IsUrl, IsArray, Length, IsOptional } from 'class-validator';
import { CreateWishlistDto } from './create-wishlist.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @Length(1, 250)
  name: string;

  @Length(1, 1500)
  @IsOptional()
  description: string;

  @IsUrl()
  image: string;

  @IsArray()
  @IsOptional()
  itemsId: number[];
}
