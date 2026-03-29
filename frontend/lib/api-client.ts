export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiClientOptions {
  baseUrl?: string;
  headers?: HeadersInit;
}

type ApiErrorPayload = {
  message?: string;
  error?: string;
}

function normalizeApiBaseUrl(value: string) {
  const trimmed = value.trim().replace(/\/$/, '');

  if (trimmed.endsWith('/api/v1')) return trimmed;
  if (trimmed.endsWith('/api')) return `${trimmed}/v1`;
  return `${trimmed}/api/v1`;
}

function resolveBaseUrl(explicitBaseUrl?: string) {
  if (explicitBaseUrl) return normalizeApiBaseUrl(explicitBaseUrl);

  if (typeof window === 'undefined') {
    const serverBase = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:3001';
    return normalizeApiBaseUrl(serverBase);
  }

  const browserBase = process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1';
  return normalizeApiBaseUrl(browserBase);
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = resolveBaseUrl(options.baseUrl);
    this.defaultHeaders = options.headers ?? { 'Content-Type': 'application/json' };
  }

  private buildUrl(path: string): string {
    if (path.startsWith('http')) return path;

    const normalizedBase = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${normalizedBase}${normalizedPath}`;
  }

  async request<T>(path: string, init?: RequestInit): Promise<T> {
    const url = this.buildUrl(path);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
        headers: { ...this.defaultHeaders, ...(init?.headers || {}) },
      });

      let payload: unknown = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        payload = await response.json();
      } else {
        payload = await response.text();
      }

      if (!response.ok) {
        const errorPayload = typeof payload === 'object' && payload !== null ? (payload as ApiErrorPayload) : null;
        const message = errorPayload?.message || errorPayload?.error || `HTTP ${response.status}`;
        throw new Error(typeof message === 'string' ? message : 'Request failed');
      }

      return payload as T;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`API timeout when requesting ${url}`);
      }

      if (error instanceof TypeError) {
        throw new Error(
          `Cannot connect to backend API at ${url}. Please make sure the NestJS backend is running and the frontend API base URL is configured correctly.`,
        );
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  get<T>(path: string, init?: RequestInit) {
    return this.request<T>(path, { ...(init || {}), method: 'GET' });
  }

  post<T, B = unknown>(path: string, body?: B, init?: RequestInit) {
    return this.request<T>(path, {
      ...(init || {}),
      method: 'POST',
      body: body != null ? JSON.stringify(body) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
