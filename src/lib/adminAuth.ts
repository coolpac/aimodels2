export function getAdminIds(): number[] {
  return (process.env.ADMIN_TELEGRAM_IDS || '')
    .split(',')
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => !isNaN(id));
}

export function isAdmin(telegramId: number | string | undefined): boolean {
  // Временно: на локалке в dev режиме пускаем без TG
  if (process.env.NODE_ENV === 'development' && (telegramId === 'localhost' || telegramId === 0)) return true;
  if (!telegramId) return false;
  const id = typeof telegramId === 'string' ? parseInt(telegramId, 10) : telegramId;
  if (isNaN(id)) return false;
  return getAdminIds().includes(id);
}
