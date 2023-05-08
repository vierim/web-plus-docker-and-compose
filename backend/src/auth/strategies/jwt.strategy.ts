import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../../users/users.service';

import { User } from '../../users/entities/user.entity';

const { JWT_SECRET } = process.env;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(jwtPayload: { sub: string }): Promise<User> {
    const user = await this.usersService.find({ id: parseInt(jwtPayload.sub) });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
