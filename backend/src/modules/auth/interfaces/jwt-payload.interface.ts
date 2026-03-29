export type AdminRole = 'SUPER_ADMIN' | 'EDITOR' | 'VIEWER';
export type AdminPermission =
  | 'dashboard.read'
  | 'lead.read'
  | 'lead.write'
  | 'lead.delete'
  | 'product.read'
  | 'product.write'
  | 'product.delete'
  | 'content.read'
  | 'content.write'
  | 'content.delete'
  | 'service.read'
  | 'service.write'
  | 'service.delete'
  | 'pricing.read'
  | 'pricing.write'
  | 'pricing.delete'
  | 'feedback.read'
  | 'feedback.write'
  | 'feedback.delete'
  | 'showcase.read'
  | 'showcase.write'
  | 'showcase.delete'
  | 'settings.read'
  | 'settings.write'
  | 'media.read'
  | 'media.write';

export interface JwtPayload {
  sub: number;
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
}
