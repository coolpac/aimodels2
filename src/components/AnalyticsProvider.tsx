'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

type EventPayload = {
  event_type: 'page_view' | 'click' | 'time_spent' | 'session_start';
  path?: string;
  session_id?: string;
  event_label?: string;
  duration_ms?: number;
  metadata?: Record<string, unknown>;
};

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'mc_session_id';
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(key, id);
  return id;
}

const ADMIN_PATH_PREFIX = '/admin';

function isAdminPath(path: string | undefined): boolean {
  if (!path) return false;
  return path === ADMIN_PATH_PREFIX || path.startsWith(ADMIN_PATH_PREFIX + '/');
}

function sendEvent(payload: EventPayload) {
  if (typeof window === 'undefined') return;
  if (isAdminPath(payload.path)) return;
  const body = JSON.stringify(payload);
  const url = '/api/analytics/track';
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
  } else {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const sessionIdRef = useRef<string>('');
  const pageStartRef = useRef<number>(performance.now());
  const lastPathRef = useRef<string>('');

  useEffect(() => {
    sessionIdRef.current = getSessionId();
    const path = pathname || '/';
    if (!isAdminPath(path)) {
      sendEvent({
        event_type: 'session_start',
        session_id: sessionIdRef.current,
        path,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track page view + time spent on previous page (админку не учитываем)
  useEffect(() => {
    const currentPath = pathname || '/';
    const prevPath = lastPathRef.current;
    if (prevPath && !isAdminPath(prevPath)) {
      const duration = Math.max(0, performance.now() - pageStartRef.current);
      sendEvent({
        event_type: 'time_spent',
        session_id: sessionIdRef.current,
        path: prevPath,
        duration_ms: Math.round(duration),
      });
    }
    if (!isAdminPath(currentPath)) {
      sendEvent({
        event_type: 'page_view',
        session_id: sessionIdRef.current,
        path: currentPath,
      });
    }
    lastPathRef.current = currentPath;
    pageStartRef.current = performance.now();
  }, [pathname]);

  // Track time on tab hide/close (не считаем время на админке)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        const path = lastPathRef.current || pathname || '/';
        if (!isAdminPath(path)) {
          const duration = Math.max(0, performance.now() - pageStartRef.current);
          sendEvent({
            event_type: 'time_spent',
            session_id: sessionIdRef.current,
            path,
            duration_ms: Math.round(duration),
          });
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [pathname]);

  // Track button/link clicks (на страницах админки не учитываем)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (isAdminPath(pathname || '/')) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest('button, a') as HTMLElement | null;
      if (!el) return;
      const label =
        el.getAttribute('data-analytics-label') ||
        el.textContent?.trim().slice(0, 120) ||
        el.getAttribute('aria-label') ||
        'click';
      const href = (el as HTMLAnchorElement).href || '';
      sendEvent({
        event_type: 'click',
        session_id: sessionIdRef.current,
        path: pathname || '/',
        event_label: label,
        metadata: href ? { href } : undefined,
      });
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [pathname]);

  return <>{children}</>;
}
