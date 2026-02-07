'use client';

import { useEffect, useState } from 'react';
import { adminGet } from '@/lib/useAdminApi';

type Summary = {
  unique_visitors: number;
  total_page_views: number;
  unique_page_views: number;
  total_clicks: number;
  total_time_ms: number;
  bot_users: number;
};

type TopClick = {
  event_label: string;
  path: string;
  clicks: number;
};

type PageStat = {
  path: string;
  page_views: number;
  unique_visitors: number;
  time_ms: number;
};

type CountryStat = {
  country_code: string;
  visitors: number;
};

function formatDuration(ms: number): string {
  if (!ms) return '0 мин';
  const totalSec = Math.round(ms / 1000);
  const minutes = Math.floor(totalSec / 60);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) return `${hours} ч ${mins} мин`;
  return `${minutes} мин`;
}

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [topClicks, setTopClicks] = useState<TopClick[]>([]);
  const [pageStats, setPageStats] = useState<PageStat[]>([]);
  const [topCountries, setTopCountries] = useState<CountryStat[]>([]);

  useEffect(() => {
    adminGet<Summary>('/api/admin/analytics/summary').then(setSummary).catch(console.error);
    adminGet<{ top_clicks: TopClick[]; page_stats: PageStat[]; top_countries: CountryStat[] }>('/api/admin/analytics/detail')
      .then((d) => {
        setTopClicks(d.top_clicks || []);
        setPageStats(d.page_stats || []);
        setTopCountries(d.top_countries || []);
      })
      .catch(console.error);
  }, []);

  const avgTime = summary && summary.unique_visitors
    ? summary.total_time_ms / summary.unique_visitors
    : 0;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="text-white text-xl font-bold">Аналитика</h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.open('/api/admin/analytics/export?type=events', '_blank')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/15"
          >
            ⬇️ Экспорт событий (CSV)
          </button>
          <button
            type="button"
            onClick={() => window.open('/api/admin/analytics/export?type=page_stats', '_blank')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/15"
          >
            ⬇️ Экспорт страниц (CSV)
          </button>
          <button
            type="button"
            onClick={() => window.open('/api/admin/analytics/export?type=top_clicks', '_blank')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/15"
          >
            ⬇️ Экспорт кликов (CSV)
          </button>
          <button
            type="button"
            onClick={() => window.open('/api/admin/analytics/export?type=top_countries', '_blank')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/15"
          >
            ⬇️ Экспорт стран (CSV)
          </button>
        </div>
      </div>

      <p className="text-white/40 text-xs mb-4">
        Уникальные = один раз за сессию. Всего = каждый заход/действие считается.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-white/50 text-xs mb-1">Уникальные посетители</p>
          <p className="text-white/40 text-[10px] mb-2">разные сессии</p>
          <p className="text-white text-2xl font-bold">{summary?.unique_visitors ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-white/50 text-xs mb-1">Просмотры страниц — всего</p>
          <p className="text-white/40 text-[10px] mb-2">каждый переход на страницу</p>
          <p className="text-white text-2xl font-bold">{summary?.total_page_views ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-white/50 text-xs mb-1">Уникальные просмотры страниц</p>
          <p className="text-white/40 text-[10px] mb-2">страница в сессии без повтора</p>
          <p className="text-[#D3F800] text-2xl font-bold">{summary?.unique_page_views ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-white/50 text-xs mb-1">Клики — всего</p>
          <p className="text-white/40 text-[10px] mb-2">все нажатия по кнопкам/ссылкам</p>
          <p className="text-white text-2xl font-bold">{summary?.total_clicks ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-white/50 text-xs mb-2">Общее время на сайте</p>
          <p className="text-white text-2xl font-bold">{formatDuration(summary?.total_time_ms ?? 0)}</p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-white/50 text-xs mb-2">Среднее время на посетителя</p>
          <p className="text-white text-2xl font-bold">{formatDuration(avgTime)}</p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-white/50 text-xs mb-2">Пользователей бота</p>
          <p className="text-white text-2xl font-bold">{summary?.bot_users ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <h2 className="text-white text-sm font-semibold mb-3">Топ‑10 кликов по кнопкам</h2>
          {topClicks.length === 0 ? (
            <p className="text-white/40 text-xs">Пока нет данных</p>
          ) : (
            <div className="space-y-2">
              {topClicks.map((c, i) => (
                <div key={`${c.event_label}-${c.path}-${i}`} className="flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <p className="text-white/80 truncate">{c.event_label}</p>
                    <p className="text-white/40 truncate">{c.path}</p>
                  </div>
                  <span className="text-[#D3F800] font-semibold">{c.clicks}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <h2 className="text-white text-sm font-semibold mb-1">Страницы</h2>
          <p className="text-white/40 text-[10px] mb-3">просмотров всего · уникальных посетителей · время</p>
          {pageStats.length === 0 ? (
            <p className="text-white/40 text-xs">Пока нет данных</p>
          ) : (
            <div className="space-y-2">
              {pageStats.map((p) => (
                <div key={p.path} className="flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="text-white/80 truncate">{p.path}</p>
                    <p className="text-white/40 truncate">
                      {p.page_views} всего · {p.unique_visitors} уник.
                    </p>
                  </div>
                  <span className="text-white/70">{formatDuration(p.time_ms)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mt-6">
        <h2 className="text-white text-sm font-semibold mb-3">Топ‑10 стран</h2>
        {topCountries.length === 0 ? (
          <p className="text-white/40 text-xs">Пока нет данных</p>
        ) : (
          <div className="space-y-2">
            {(() => {
              const max = Math.max(...topCountries.map((c) => c.visitors), 1);
              return topCountries.map((c) => (
                <div key={c.country_code} className="flex items-center gap-3 text-xs">
                  <span className="w-10 text-white/70">{c.country_code}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#075500] to-[#D3F800]"
                      style={{ width: `${Math.round((c.visitors / max) * 100)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-white/80">{c.visitors}</span>
                </div>
              ));
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
