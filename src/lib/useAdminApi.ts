'use client';

function getTgId(): string {
  if (typeof window === 'undefined') return '';
  // Try to get from layout's data attribute
  const main = document.querySelector('[data-tg-id]');
  return main?.getAttribute('data-tg-id') || '';
}

export async function adminFetch(url: string, options?: RequestInit) {
  const tgId = getTgId();
  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      'x-telegram-user-id': tgId,
    },
  });
}

export async function adminGet<T>(url: string): Promise<T> {
  const res = await adminFetch(url);
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

export async function adminPut(url: string, data: Record<string, unknown>) {
  const res = await adminFetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}
