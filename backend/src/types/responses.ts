import { User } from '../users/entities/user.entity';

export type TSigninResponse = {
  access_token: string;
};

export type TUserResponse = Omit<User, 'password'>;
