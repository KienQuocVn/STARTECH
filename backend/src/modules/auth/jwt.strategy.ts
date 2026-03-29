import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { resolvePermissionsForRole } from './permissions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'startech-dev-secret',
    });
  }

  validate(payload: JwtPayload) {
    return {
      ...payload,
      permissions: payload.permissions?.length ? payload.permissions : resolvePermissionsForRole(payload.role),
    };
  }
}
