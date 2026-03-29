import { apiClient } from '@/lib/api-client';

export type AdminRole = 'SUPER_ADMIN' | 'EDITOR' | 'VIEWER';

export type AuthUser = {
  id: number;
  email: string;
  fullName: string;
  role: AdminRole;
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
