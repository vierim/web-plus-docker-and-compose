import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @IsString({
    message: 'Название подарка может быть только строкой',
  })
  @MinLength(1, {
    message: 'Название подарка не может быть короче 1 символа',
  })
  @MaxLength(250, {
    message: 'Название подарка не может быть длиннее 250 символов',
  })
  name: string;

  @IsOptional()
  @IsUrl()
  link: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  @Min(1, {
    message: 'Стоимость подарка должна быть больше нуля',
  })
  price: number;

  @IsNotEmpty()
  @IsString({
    message: 'Описание подарка может быть только текстом',
  })
  @MinLength(1, {
    message: 'Описание подарка не может быть короче 1 символа',
  })
  @MaxLength(1024, {
    message: 'Описание подарка не может быть длиннее 1024 символов',
  })
  description: string;
}
