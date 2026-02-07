'use client';

import { useState, useRef, useEffect } from 'react';

interface PaymentFormProps {
  formType: 'CRYPTO' | 'USD';
}

type TgUser = { id: number; username?: string };

function getTgUser(): TgUser | undefined {
  if (typeof window === 'undefined') return undefined;
  const tg = (window as unknown as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: TgUser } } } }).Telegram?.WebApp;
  return tg?.initDataUnsafe?.user;
}

export default function PaymentForm({ formType }: PaymentFormProps) {
  const [email, setEmail] = useState('');
  const [tgUsername, setTgUsername] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [docLinks, setDocLinks] = useState<{ privacy?: string; consent?: string; offer?: string }>({});
  const [agreeConsent, setAgreeConsent] = useState(false);
  const [agreeOffer, setAgreeOffer] = useState(false);
  const [tgUserId, setTgUserId] = useState<string>('');

  // Предзаполнение Ник ТГ / ID из Telegram Web App или из query-параметров
  useEffect(() => {
    const fromQuery = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const queryUsername = fromQuery?.get('tg_username') ?? fromQuery?.get('username');
    const queryId = fromQuery?.get('tg_id') ?? fromQuery?.get('user_id');
    if (queryUsername) {
      setTgUsername(queryUsername.startsWith('@') ? queryUsername : `@${queryUsername}`);
    }
    if (queryId) {
      setTgUsername(queryId);
      setTgUserId(queryId);
    }

    const user = getTgUser();
    if (user?.id) setTgUserId(String(user.id));
    if (!queryUsername && !queryId && user) {
      if (user.username) {
        setTgUsername(user.username.startsWith('@') ? user.username : `@${user.username}`);
      } else {
        setTgUsername(String(user.id));
      }
    }
  }, []);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((data: { key: string; value: string }[]) => {
        const map: Record<string, string> = {};
        data.forEach((c) => (map[c.key] = c.value));
        setDocLinks({
          privacy: map.privacy_policy_url || '#',
          consent: map.consent_personal_data_url || '#',
          offer: map.public_offer_url || '#',
        });
      })
      .catch(() => {});
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Загрузите изображение (JPG, PNG, WEBP)');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('Максимальный размер файла — 10MB');
      return;
    }
    setFile(f);
    setError('');
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !tgUsername || !file) {
      setError('Заполните все поля и приложите скриншот');
      return;
    }
    if (!agreeConsent || !agreeOffer) {
      setError('Отметьте согласие на обработку персональных данных и публичную оферту');
      return;
    }

    // ID — только цифры, отправляем как есть; username — с @
    const isNumericId = /^\d+$/.test(tgUsername.trim());
    const username = isNumericId ? tgUsername.trim() : (tgUsername.startsWith('@') ? tgUsername : `@${tgUsername}`);

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('formType', formType);
      formData.append('email', email);
      formData.append('tgUsername', username);
      if (tgUserId) formData.append('tgUserId', tgUserId);
      formData.append('screenshot', file);

      const res = await fetch('/api/form/submit', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Ошибка отправки');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5 form-page-bg">
        <div className="glass-card rounded-2xl p-8 max-w-[480px] w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-white text-xl font-bold mb-3">Форма отправлена!</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Доступ будет выдан автоматически в течение часа после подтверждения оплаты.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 form-page-bg">
      <div className="w-full max-w-[480px]">
        <h1 className="text-white text-xl lg:text-2xl font-bold mb-3 text-center leading-snug uppercase tracking-wide">
          Заполните анкету
        </h1>

        <p className="text-white/60 text-sm text-center mb-4 leading-relaxed">
          Пожалуйста, заполните форму для получения доступа к обучению.
        </p>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-5 lg:p-6 space-y-4">
          {/* Email */}
          <div>
            <label className="text-white/90 text-sm font-medium mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 rounded-xl text-white text-sm bg-white/5 border border-white/10 outline-none focus:border-[#D3F800]/50 transition placeholder:text-white/30"
            />
          </div>

          {/* Ник ТГ или ID */}
          <div>
            <label className="text-white/90 text-sm font-medium mb-1.5 block">Ник ТГ или ID</label>
            <input
              type="text"
              value={tgUsername}
              onChange={(e) => setTgUsername(e.target.value)}
              placeholder="@username или ID"
              required
              className="w-full px-4 py-3 rounded-xl text-white text-sm bg-white/5 border border-white/10 outline-none focus:border-[#D3F800]/50 transition placeholder:text-white/30"
            />
          </div>

          {/* Screenshot upload */}
          <div>
            <label className="text-white/90 text-sm font-medium mb-1.5 block">Скриншот оплаты</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full px-4 py-3 rounded-xl text-sm border border-dashed border-white/20 bg-white/5 text-white/50 hover:border-[#D3F800]/40 hover:text-white/70 transition text-center"
            >
              {file ? file.name : '📎 Нажмите для загрузки'}
            </button>
            {preview && (
              <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                <img src={preview} alt="Preview" className="w-full h-auto max-h-[200px] object-contain bg-black/50" />
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Согласия с галочками — перед кнопкой Отправить */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreeConsent}
                onChange={(e) => setAgreeConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-2 border-white/30 bg-white/5 text-[#D3F800] focus:ring-[#D3F800]/50 focus:ring-offset-0 focus:ring-2 cursor-pointer accent-[#D3F800]"
              />
              <span className="text-white/90 text-sm flex-1">
                Я согласен с{' '}
                <a href={docLinks.consent} target="_blank" rel="noopener noreferrer" className="text-[#D3F800] underline hover:no-underline" onClick={(e) => e.stopPropagation()}>
                  согласием на обработку персональных данных
                </a>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreeOffer}
                onChange={(e) => setAgreeOffer(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-2 border-white/30 bg-white/5 text-[#D3F800] focus:ring-[#D3F800]/50 focus:ring-offset-0 focus:ring-2 cursor-pointer accent-[#D3F800]"
              />
              <span className="text-white/90 text-sm flex-1">
                Я согласен с{' '}
                <a href={docLinks.offer} target="_blank" rel="noopener noreferrer" className="text-[#D3F800] underline hover:no-underline" onClick={(e) => e.stopPropagation()}>
                  публичной офертой
                </a>
              </span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gradient w-full py-3.5 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </div>
  );
}
