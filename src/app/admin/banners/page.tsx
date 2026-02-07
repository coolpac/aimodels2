'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { adminGet, adminFetch } from '@/lib/useAdminApi';

interface Banner {
  id: number;
  carousel_id: string;
  image_path: string;
  order_index: number;
  enabled: number;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [uploading, setUploading] = useState(false);
  const [activeGroup, setActiveGroup] = useState<'feature' | 'case' | 'faq'>('feature');
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const groups = [
    { id: 'feature', label: 'AI, который зарабатывает' },
    { id: 'case', label: 'Реальный кейс' },
    { id: 'faq', label: 'FAQ баннер' },
  ] as const;

  const loadBanners = useCallback(() => {
    adminGet<Banner[]>('/api/admin/banners').then(setBanners).catch(console.error);
  }, []);

  useEffect(loadBanners, [loadBanners]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('carouselId', activeGroup);
      const count = banners.filter((b) => b.carousel_id === activeGroup).length;
      formData.append('orderIndex', String(count));
      await adminFetch('/api/admin/banners', { method: 'POST', body: formData });
      loadBanners();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await adminFetch('/api/admin/banners', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      loadBanners();
    } catch (err) {
      console.error(err);
    }
  };

  const activeBanners = banners
    .filter((b) => b.carousel_id === activeGroup)
    .sort((a, b) => a.order_index - b.order_index);

  const handleDragStart = useCallback((e: React.DragEvent, id: number) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(id));
    e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
    setTimeout(() => {
      (e.target as HTMLElement).style.opacity = '0.5';
    }, 0);
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
    setDraggedId(null);
    setDragOverId(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedId !== null && draggedId !== id) setDragOverId(id);
  }, [draggedId]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (!e.currentTarget.contains(related)) setDragOverId(null);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent, dropId: number) => {
      e.preventDefault();
      setDragOverId(null);
      const dragId = draggedId;
      setDraggedId(null);
      (e.target as HTMLElement).style.opacity = '1';
      if (dragId == null || dragId === dropId) return;

      const fromIndex = activeBanners.findIndex((b) => b.id === dragId);
      const toIndex = activeBanners.findIndex((b) => b.id === dropId);
      if (fromIndex === -1 || toIndex === -1) return;

      const reordered = [...activeBanners];
      const [removed] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, removed);

      const order = reordered.map((b, i) => ({ id: b.id, order_index: i }));
      setSavingOrder(true);
      try {
        await adminFetch('/api/admin/banners', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order }),
        });
        setBanners((prev) =>
          prev
            .map((b) => {
              const o = order.find((x) => x.id === b.id);
              return o ? { ...b, order_index: o.order_index } : b;
            })
            .sort((a, b) => a.carousel_id.localeCompare(b.carousel_id) || a.order_index - b.order_index)
        );
      } catch (err) {
        console.error(err);
        loadBanners();
      } finally {
        setSavingOrder(false);
      }
    },
    [activeBanners, draggedId, loadBanners]
  );

  return (
    <div>
      <h1 className="text-white text-xl font-bold mb-6">Баннеры</h1>

      {/* Group tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {groups.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGroup(g.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeGroup === g.id ? 'bg-white/15 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 rounded-lg bg-[#075500] text-white text-sm font-medium hover:bg-[#096800] transition disabled:opacity-50"
        >
          {uploading ? 'Загрузка...' : '+ Загрузить баннер'}
        </button>
        <p className="text-white/40 text-xs mt-2">
          Рекомендуемый размер: 1600×900 (будет сжат до WebP). Перетащите карточки для смены порядка.
        </p>
      </div>

      {activeBanners.length === 0 ? (
        <p className="text-white/40 text-sm">Баннеров пока нет</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {activeBanners.map((b, index) => (
            <div
              key={b.id}
              draggable
              onDragStart={(e) => handleDragStart(e, b.id)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, b.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, b.id)}
              className={`rounded-xl overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing select-none touch-none ${
                dragOverId === b.id
                  ? 'border-[#D3F800] bg-white/10 ring-2 ring-[#D3F800]/50'
                  : 'border-white/10 bg-white/5'
              } ${draggedId === b.id ? 'opacity-50' : ''}`}
            >
              <div className="relative">
                <img src={b.image_path} alt="" className="w-full aspect-[16/10] object-cover pointer-events-none" />
                <div className="absolute top-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-white/80 text-xs font-medium">
                  {index + 1}
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-white/50 text-xs flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                  </svg>
                  Позиция {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(b.id)}
                  disabled={savingOrder}
                  className="text-red-400 text-xs hover:text-red-300 transition disabled:opacity-50"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {savingOrder && (
        <p className="text-white/40 text-xs mt-3">Сохранение порядка…</p>
      )}
    </div>
  );
}
