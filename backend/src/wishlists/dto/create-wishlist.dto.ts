import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString({
    message: 'Название списка подарков должно быть строкой',
  })
  @MinLength(1, {
    message: 'Название списка подарков не может быть короче 1 символа',
  })
  @MaxLength(250, {
    message: 'Название списка подарков не может быть длинее 250 символов',
  })
  name: string;

  @IsOptional()
  @IsString({
    message: 'Описание списка подарков должно быть текстом',
  })
  @MaxLength(1500, {
    message: 'Описание списка подарков не может быть длинее 1500 символов',
  })
  description: string;

  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];
}
