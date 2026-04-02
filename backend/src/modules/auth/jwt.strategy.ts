import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { resolvePermissionsForRole } from './permissions';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET must be defined before initializing JwtStrategy.');
  }

  return secret;
}

function extractTokenFromCookie(request: Request) {
  const rawCookie = request.headers.cookie;
  if (!rawCookie) return null;

  const tokenPair = rawCookie
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith('startech_admin_token='));

  if (!tokenPair) return null;

  const [, token] = tokenPair.split('=');
  return token ? decodeURIComponent(token) : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), extractTokenFromCookie]),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  validate(payload: JwtPayload) {
    return {
      ...payload,
      permissions: payload.permissions?.length ? payload.permissions : resolvePermissionsForRole(payload.role),
    };
  }
}
