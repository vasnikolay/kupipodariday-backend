import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
} from 'class-validator';
import { CreateWishDto } from './create-wish.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @Length(1, 250)
  name?: string;

  @IsUrl()
  link?: string;

  @IsUrl()
  image?: string;

  @IsNumber()
  price?: number;

  @IsNumber()
  raised?: number;

  @IsString()
  @Max(1500)
  @IsOptional()
  description?: string;
}
