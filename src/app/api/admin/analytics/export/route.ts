import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/adminAuth';
import { getAnalyticsEvents, getPageStats, getTopClicks, getTopCountries } from '@/lib/db';

function toCsv(rows: string[][]): string {
  const escape = (v: string) => {
    const s = v ?? '';
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  return rows.map((r) => r.map((c) => escape(String(c ?? ''))).join(',')).join('\n');
}

export async function GET(req: Request) {
  const tgId = req.headers.get('x-telegram-user-id');
  if (!isAdmin(tgId ?? undefined)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const type = (searchParams.get('type') || 'events').toLowerCase();
  const limit = Math.min(Number(searchParams.get('limit') || '10000'), 50000);

  let csv = '';
  let filename = 'analytics.csv';

  if (type === 'page_stats') {
    const rows = getPageStats();
    csv = toCsv([
      ['path', 'page_views', 'unique_visitors', 'time_ms'],
      ...rows.map((r) => [r.path, String(r.page_views), String(r.unique_visitors), String(r.time_ms)]),
    ]);
    filename = 'analytics-page-stats.csv';
  } else if (type === 'top_clicks') {
    const rows = getTopClicks(10);
    csv = toCsv([
      ['label', 'path', 'clicks'],
      ...rows.map((r) => [r.event_label, r.path, String(r.clicks)]),
    ]);
    filename = 'analytics-top-clicks.csv';
  } else if (type === 'top_countries') {
    const rows = getTopCountries(10);
    csv = toCsv([
      ['country_code', 'visitors'],
      ...rows.map((r) => [r.country_code, String(r.visitors)]),
    ]);
    filename = 'analytics-top-countries.csv';
  } else {
    const rows = getAnalyticsEvents(limit);
    csv = toCsv([
      ['id', 'event_type', 'path', 'session_id', 'event_label', 'duration_ms', 'country_code', 'metadata', 'user_agent', 'referrer', 'created_at'],
      ...rows.map((r) => [
        String(r.id),
        r.event_type,
        r.path || '',
        r.session_id || '',
        r.event_label || '',
        String(r.duration_ms || 0),
        r.country_code || '',
        r.metadata || '',
        r.user_agent || '',
        r.referrer || '',
        r.created_at,
      ]),
    ]);
    filename = 'analytics-events.csv';
  }

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
