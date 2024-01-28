import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferDto } from './create-offer.dto';
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateOfferDto extends PartialType(CreateOfferDto) {
  @IsNumber()
  @Min(1)
  readonly amount?: number;

  @IsBoolean()
  @IsOptional()
  readonly hidden?: boolean;

  @IsNumber()
  readonly itemId?: number;
}
