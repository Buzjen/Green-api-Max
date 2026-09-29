import type { ApiCredentials } from './types';

export class ApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(body || `HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

interface RequestOptions {
  method: 'GET' | 'POST' | 'DELETE';
  /** Имя метода API, например `sendMessage`. */
  apiMethod: string;
  /** Дополнительные сегменты пути после токена (например, receiptId). */
  pathSuffix?: string;
  query?: Record<string, string | number>;
  body?: unknown;
  signal?: AbortSignal;
}

export function buildUrl(
  credentials: ApiCredentials,
  options: RequestOptions,
): string {
  const base = credentials.apiUrl.replace(/\/+$/, '');
  const suffix = options.pathSuffix
    ? `/${encodeURIComponent(options.pathSuffix)}`
    : '';
  const id = encodeURIComponent(credentials.idInstance);
  const token = encodeURIComponent(credentials.apiTokenInstance);
  const url = `${base}/waInstance${id}/${options.apiMethod}/${token}${suffix}`;

  if (!options.query) return url;
  const params = new URLSearchParams(
    Object.entries(options.query).map(([key, value]) => [key, String(value)]),
  );
  return `${url}?${params.toString()}`;
}

/**
 * Выполняет запрос к GREEN-API. Пустое тело ответа возвращается как `null`.
 * URL содержит токен, поэтому он нигде не логируется.
 */
export async function request<T>(
  credentials: ApiCredentials,
  options: RequestOptions,
): Promise<T | null> {
  const response = await fetch(buildUrl(credentials, options), {
    method: options.method,
    headers:
      options.body === undefined
        ? undefined
        : { 'Content-Type': 'application/json' },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  });

  const text = await response.text();
  if (!response.ok) throw new ApiError(response.status, extractErrorText(text));
  if (!text.trim()) return null;
  return JSON.parse(text) as T | null;
}

function extractErrorText(text: string): string {
  try {
    const data = JSON.parse(text) as { message?: unknown; error?: unknown };
    if (typeof data.message === 'string') return data.message;
    if (typeof data.error === 'string') return data.error;
  } catch {
    // тело не JSON — вернём как есть
  }
  return text.trim();
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}
