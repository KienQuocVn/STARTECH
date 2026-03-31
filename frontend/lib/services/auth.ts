import { apiClient } from '@/lib/api-client';

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

export type AuthUser = {
  id: number;
  email: string;
  fullName: string;
  role: AdminRole;
  permissions?: AdminPermission[];
  lastLoginAt?: string | null;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: 'Bearer';
    user: AuthUser;
  };
};

export async function loginAdmin(email: string, password: string) {
  const response = await fetch('/api/admin/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const payload = (await response.json().catch(() => null)) as LoginResponse | { message?: string } | null;

  if (!response.ok) {
    throw new Error(payload && 'message' in payload && typeof payload.message === 'string' ? payload.message : 'Dang nhap that bai.');
  }

  return payload as LoginResponse;
}

export async function logoutAdmin() {
  await fetch('/api/admin/session', {
    method: 'DELETE',
  });
}

export async function getAdminProfile() {
  return apiClient.get<{ success: boolean; data: AuthUser }>('/auth/me');
}

export function getAdminAccessToken() {
  return null;
}

export function getAdminAuthHeaders() {
  return undefined;
}
