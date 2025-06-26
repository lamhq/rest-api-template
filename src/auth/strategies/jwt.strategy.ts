import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
        (req: Request) => {
          const cookies = req?.cookies as { accessToken?: string } | undefined;
          return cookies?.accessToken || null;
        },
      ]),
      ignoreExpiration: false,
      // the key used to decode and validate JWT tokens from requests
      secretOrKey: configService.get('jwtSecret'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    return Promise.resolve({ id: payload.sub, email: payload.email });
  }
}
