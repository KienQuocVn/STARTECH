export type AdminRole = 'SUPER_ADMIN' | 'EDITOR' | 'VIEWER';

export interface JwtPayload {
  sub: number;
  email: string;
  role: AdminRole;
}
