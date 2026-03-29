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
  return apiClient.post<LoginResponse, { email: string; password: string }>('/auth/login', {
    email,
    password,
  });
}

export async function getAdminProfile(accessToken: string) {
  return apiClient.get<{ success: boolean; data: AuthUser }>('/auth/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getAdminAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('startech_admin_token');
}

export function getAdminAuthHeaders() {
  const token = getAdminAccessToken();

  if (!token) return undefined;

  return {
    Authorization: `Bearer ${token}`,
  } satisfies Record<string, string>;
}
