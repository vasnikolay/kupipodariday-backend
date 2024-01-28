import { IsUrl, IsArray, Length, IsOptional } from 'class-validator';

export class CreateWishlistDto {
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
