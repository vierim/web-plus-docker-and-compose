import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({
    message: 'Имя пользователя может быть только строкой',
  })
  @MinLength(2, {
    message: 'Имя пользователя не может быть короче 2 символов',
  })
  @MaxLength(30, {
    message: 'Имя пользователя не может быть длинее 30 символов',
  })
  username: string;

  @IsOptional()
  @IsString({
    message: 'Описание пользователя может быть только текстом',
  })
  @MaxLength(200)
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  @IsNotEmpty({
    message: 'Поле с паролем должно быть заполнено',
  })
  @IsString({
    message: 'Пароль может быть только строкой',
  })
  @MinLength(5, {
    message: 'Пароль не может быть короче 5 символов',
  })
  @MaxLength(40, {
    message: 'Пароль не может быть длинее 40 символов',
  })
  password: string;
}
