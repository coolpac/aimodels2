import { NextResponse } from 'next/server';
import { addAnalyticsEvent, getCountryFromCache, upsertCountryCache } from '@/lib/db';

type EventPayload = {
  event_type: 'page_view' | 'click' | 'time_spent' | 'session_start';
  path?: string;
  session_id?: string;
  event_label?: string;
  duration_ms?: number;
  metadata?: Record<string, unknown>;
};

function getHeaderCountry(headers: Headers): string | null {
  const candidates = [
    headers.get('x-vercel-ip-country'),
    headers.get('cf-ipcountry'),
    headers.get('x-country-code'),
    headers.get('x-geo-country'),
    headers.get('x-geo-country-code'),
  ].filter(Boolean) as string[];
  if (candidates.length === 0) return null;
  const code = candidates[0]!.toUpperCase();
  if (code === 'XX' || code.length !== 2) return null;
  return code;
}

function getClientIp(headers: Headers): string | null {
  const xff = headers.get('x-forwarded-for');
  if (xff) {
    const ip = xff.split(',')[0]?.trim();
    if (ip) return ip;
  }
  return headers.get('x-real-ip') || null;
}

function isPrivateIp(ip: string): boolean {
  return (
    ip.startsWith('10.') ||
    ip.startsWith('127.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('172.17.') ||
    ip.startsWith('172.18.') ||
    ip.startsWith('172.19.') ||
    ip.startsWith('172.2') || // 172.20-172.29
    ip.startsWith('172.30.') ||
    ip.startsWith('172.31.') ||
    ip === '::1'
  );
}

async function resolveCountryByIp(ip: string): Promise<string | null> {
  if (!ip || isPrivateIp(ip)) return null;
  const cached = getCountryFromCache(ip);
  if (cached) return cached;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`https://ipapi.co/${ip}/country/`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'analytics' },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const code = (await res.text()).trim().toUpperCase();
    if (code && code.length === 2 && code !== 'XX') {
      upsertCountryCache(ip, code);
      return code;
    }
  } catch {
    return null;
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const events: EventPayload[] = Array.isArray(body?.events) ? body.events : [body];
    const ua = req.headers.get('user-agent') || '';
    const referrer = req.headers.get('referer') || '';
    const headerCountry = getHeaderCountry(req.headers);
    const ip = getClientIp(req.headers);
    const ipCountry = headerCountry || (ip ? await resolveCountryByIp(ip) : null);

    const isAdminPath = (path: string | undefined) => {
      if (!path) return false;
      return path === '/admin' || path.startsWith('/admin/');
    };

    for (const e of events) {
      if (!e?.event_type) continue;
      if (isAdminPath(e.path)) continue;
      addAnalyticsEvent({
        event_type: e.event_type,
        path: e.path,
        session_id: e.session_id,
        event_label: e.event_label,
        duration_ms: e.duration_ms,
        country_code: ipCountry || undefined,
        metadata: e.metadata,
        user_agent: ua,
        referrer,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Analytics track error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
