import type { AdminRole } from './interfaces/jwt-payload.interface';

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

export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  SUPER_ADMIN: [
    'dashboard.read',
    'lead.read',
    'lead.write',
    'lead.delete',
    'product.read',
    'product.write',
    'product.delete',
    'content.read',
    'content.write',
    'content.delete',
    'service.read',
    'service.write',
    'service.delete',
    'pricing.read',
    'pricing.write',
    'pricing.delete',
    'feedback.read',
    'feedback.write',
    'feedback.delete',
    'showcase.read',
    'showcase.write',
    'showcase.delete',
    'settings.read',
    'settings.write',
    'media.read',
    'media.write',
  ],
  EDITOR: [
    'dashboard.read',
    'lead.read',
    'lead.write',
    'product.read',
    'product.write',
    'content.read',
    'content.write',
    'service.read',
    'service.write',
    'pricing.read',
    'pricing.write',
    'feedback.read',
    'feedback.write',
    'showcase.read',
    'showcase.write',
    'settings.read',
    'settings.write',
    'media.read',
    'media.write',
  ],
  VIEWER: [
    'dashboard.read',
    'lead.read',
    'product.read',
    'content.read',
    'service.read',
    'pricing.read',
    'feedback.read',
    'showcase.read',
    'settings.read',
    'media.read',
  ],
};

export function resolvePermissionsForRole(role: AdminRole): AdminPermission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
