import { IsNotEmpty, Min, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @Min(1, {
    message: 'Сумма для заявки должна быть больше нуля',
  })
  amount: number;

  @IsOptional()
  hidden: boolean;

  @IsNotEmpty()
  itemId: number;
}
