import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data.db');

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    initTables(_db);
    seedDefaults(_db);
  }
  return _db;
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS bot_messages (
      key TEXT PRIMARY KEY,
      content TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      carousel_id TEXT NOT NULL DEFAULT 'feature',
      image_path TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      enabled INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS analytics_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      path TEXT,
      session_id TEXT,
      event_label TEXT,
      duration_ms REAL DEFAULT 0,
      country_code TEXT,
      metadata TEXT,
      user_agent TEXT,
      referrer TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ip_geo_cache (
      ip TEXT PRIMARY KEY,
      country_code TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bot_users (
      tg_id TEXT PRIMARY KEY,
      username TEXT,
      first_name TEXT,
      last_name TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      last_seen_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS form_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      form_type TEXT NOT NULL,
      email TEXT NOT NULL,
      tg_username TEXT NOT NULL,
      tg_user_id TEXT,
      screenshot_path TEXT,
      price_usd REAL DEFAULT 0,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      payment_marked_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Ensure new columns exist for older DBs
  const cols = db.prepare("PRAGMA table_info('form_submissions')").all() as { name: string }[];
  const has = (name: string) => cols.some((c) => c.name === name);
  if (!has('tg_user_id')) db.exec(`ALTER TABLE form_submissions ADD COLUMN tg_user_id TEXT`);
  if (!has('price_usd')) db.exec(`ALTER TABLE form_submissions ADD COLUMN price_usd REAL DEFAULT 0`);
  if (!has('payment_status')) db.exec(`ALTER TABLE form_submissions ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'pending'`);
  if (!has('payment_marked_at')) db.exec(`ALTER TABLE form_submissions ADD COLUMN payment_marked_at TEXT`);

  // Backfill status for existing rows
  db.exec(`UPDATE form_submissions SET payment_status = 'pending' WHERE payment_status IS NULL OR payment_status = ''`);

  // Ensure analytics_events has country_code for older DBs
  const aCols = db.prepare("PRAGMA table_info('analytics_events')").all() as { name: string }[];
  const hasA = (name: string) => aCols.some((c) => c.name === name);
  if (!hasA('country_code')) db.exec(`ALTER TABLE analytics_events ADD COLUMN country_code TEXT`);
}

function seedDefaults(db: Database.Database) {
  const insertMsg = db.prepare(
    'INSERT OR IGNORE INTO bot_messages (key, content) VALUES (?, ?)'
  );
  const insertCfg = db.prepare(
    'INSERT OR IGNORE INTO config (key, value) VALUES (?, ?)'
  );

  // ─── Bot messages ───

  insertMsg.run('welcome', 'Добрый день, на связи бот MODELCORE AI\nЯ помогу Вам оплатить обучение удобным способом.\nВыберите, как хотите оплатить');

  insertMsg.run('welcome_generic', 'Добрый день, на связи бот MODELCORE AI 👋\nЯ помогу Вам с любыми вопросами по обучению.\n\nНажмите кнопку «Купить» на сайте, чтобы начать оплату.');

  insertMsg.run('eu_card_info', 'Оплата картой из ЕС (требуется верификация KYC)\n\nПожалуйста, следуйте инструкции по ссылке ниже (с ценой {price}$).\n\nОбязательно сохраните скриншот оплаты и заполните форму ниже для выдачи доступа к курсу');

  insertMsg.run('crypto_select', 'Вы можете оплатить обучение в USDT - выберите сеть:');

  insertMsg.run('crypto_payment', 'Пожалуйста, оплатите {price} USDT на адрес кошелька\nUSDT {network}:\n`{wallet}`\n\nОбязательно сохраните скриншот оплаты и заполните форму ниже для выдачи доступа к курсу');

  insertMsg.run('cis_select', 'Пожалуйста, укажите Вашу страну:');

  insertMsg.run('cis_russia', '🇷🇺 Россия\n\nИз-за отсутствия возможности принять оплату из Вашей страны на банк ЕС, для совершения оплаты Вы можете воспользоваться одним из сторонних обменников ниже, чтобы обменять RUB на USDT (Tether)\n\n{exchangers}\n\nС помощью выбранного обменника переведите {amount} ({price}$) в USDT TRC20 !!!\n(убедитесь, что в RECEIVE Вы выбрали именно USDT (Tether) TRC20)\n\nАдрес кошелька USDT TRC20:\n`{wallet_trc20}`\n\nОбязательно сохраните скриншот оплаты и заполните форму ниже для выдачи доступа к курсу');

  insertMsg.run('cis_belarus', '🇧🇾 Беларусь\n\nСвяжитесь с тех. поддержкой, чтобы совершить оплату в BYN');

  insertMsg.run('cis_ukraine', '🇺🇦 Украина\n\nИз-за отсутствия возможности принять оплату из Вашей страны на банк ЕС, для совершения оплаты Вы можете воспользоваться одним из сторонних обменников ниже, чтобы обменять UAH на USDT (Tether)\n\n{exchangers}\n\nС помощью выбранного обменника переведите {amount} ({price}$) в USDT TRC20 !!!\n(убедитесь, что в RECEIVE Вы выбрали именно USDT (Tether) TRC20)\n\nАдрес кошелька USDT TRC20:\n`{wallet_trc20}`\n\nОбязательно сохраните скриншот оплаты и заполните форму ниже для выдачи доступа к курсу');

  insertMsg.run('cis_kazakhstan', '🇰🇿 Казахстан\n\nИз-за отсутствия возможности принять оплату из Вашей страны на банк ЕС, для совершения оплаты Вы можете воспользоваться одним из сторонних обменников ниже, чтобы обменять KZT на USDT (Tether)\n\n{exchangers}\n\nС помощью выбранного обменника переведите {amount} ({price}$) в USDT TRC20 !!!\n(убедитесь, что в RECEIVE Вы выбрали именно USDT (Tether) TRC20)\n\nАдрес кошелька USDT TRC20:\n`{wallet_trc20}`\n\nОбязательно сохраните скриншот оплаты и заполните форму ниже для выдачи доступа к курсу');

  insertMsg.run('cis_other', 'Для оплаты из Вашей страны, пожалуйста, свяжитесь с тех. поддержкой');

  insertMsg.run('paypal_info', 'Оплата через PayPal\n\nОбязательно сохраните скриншот оплаты и заполните форму ниже для выдачи доступа к курсу');

  insertMsg.run('form_success', '✅ Спасибо! Ваша заявка принята.\n\nДоступ будет выдан автоматически в течение часа после подтверждения оплаты.');

  // ─── Config ───

  insertCfg.run('price_current', '450');
  insertCfg.run('price_old', '600');
  insertCfg.run('support_username', 'modelcoresupport');

  // Wallets
  insertCfg.run('wallet_erc20', '0x4a116aa661319b1688b704e4714fda93a5d8bc25');
  insertCfg.run('wallet_bep20', '0x4a116aa661319b1688b704e4714fda93a5d8bc25');
  insertCfg.run('wallet_trc20', 'TDFa6rNdMqSHWKHm6cFwFKjA7iYQKHLkLP');

  // PayPal / Selly
  insertCfg.run('selly_url', 'https://aimodelcore.selly.store/product/fd8f4c1c');
  insertCfg.run('paypal_email', 'aimodelcore@gmail.com');

  // CIS exchangers (JSON arrays)
  insertCfg.run('cis_russia_exchangers', JSON.stringify([
    { name: 'SWAPCOIN', url: 'https://swapcoin.cc/swap/' },
    { name: 'COOLCOIN', url: 'https://coolcoin.best/new/?rid=27&lang=en&cur_from=CARDRUB&cur_to=USDTTRC20' },
    { name: 'BIXTER', url: 'https://bixter.org/exchange/mir_rub-tether_usdt_trc20' },
  ]));
  insertCfg.run('cis_russia_amount', '34 000 RUB');

  insertCfg.run('cis_ukraine_exchangers', JSON.stringify([
    { name: 'FLASHCASH', url: 'https://en.flashcash.top/exchange/carduah-usdttrc20' },
    { name: 'CRYPTOROYAL', url: 'https://cryptoroyal.exchange/en/?from=CARDUAH&to=USDTTRC20' },
    { name: '818 FINANCE', url: 'https://www.818.finance/en/?from=CARDUAH&to=USDTTRC20' },
  ]));
  insertCfg.run('cis_ukraine_amount', '19 300 UAH');

  insertCfg.run('cis_kazakhstan_exchangers', JSON.stringify([
    { name: 'FINCHPAY', url: 'https://widget.finchpay.io/?a=211500&c=KZT&cc=USDT&cn=TRC20&partner_id=0c14670319406bc92cb4831d45d4e5d05b4e5a2b' },
    { name: 'BITCOINBOX', url: 'https://www.bitcoinbox.io/en/?from=CARDKZT&to=USDTTRC20' },
    { name: 'BUYCOIN', url: 'https://buycoin.online/' },
  ]));
  insertCfg.run('cis_kazakhstan_amount', '226 300 KZT');
}

// ─── Query helpers ───

export function getBotMessage(key: string): string {
  const db = getDb();
  const row = db.prepare('SELECT content FROM bot_messages WHERE key = ?').get(key) as { content: string } | undefined;
  return row?.content || '';
}

export function getAllBotMessages(): { key: string; content: string }[] {
  const db = getDb();
  return db.prepare('SELECT key, content FROM bot_messages ORDER BY key').all() as { key: string; content: string }[];
}

export function updateBotMessage(key: string, content: string): void {
  const db = getDb();
  db.prepare('UPDATE bot_messages SET content = ? WHERE key = ?').run(content, key);
}

export function getConfig(key: string): string {
  const db = getDb();
  const row = db.prepare('SELECT value FROM config WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value || '';
}

export function getAllConfig(): { key: string; value: string }[] {
  const db = getDb();
  return db.prepare('SELECT key, value FROM config ORDER BY key').all() as { key: string; value: string }[];
}

export function updateConfig(key: string, value: string): void {
  const db = getDb();
  db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)').run(key, value);
}

export function addFormSubmission(data: {
  form_type: string;
  email: string;
  tg_username: string;
  tg_user_id?: string;
  screenshot_path: string;
  price_usd: number;
}): number {
  const db = getDb();
  const result = db.prepare(
    'INSERT INTO form_submissions (form_type, email, tg_username, tg_user_id, screenshot_path, price_usd, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(
    data.form_type,
    data.email,
    data.tg_username,
    data.tg_user_id || null,
    data.screenshot_path,
    data.price_usd,
    'pending'
  );
  return Number(result.lastInsertRowid);
}

export function getFormSubmissions(limit = 50): {
  id: number;
  form_type: string;
  email: string;
  tg_username: string;
  tg_user_id?: string;
  screenshot_path: string;
  price_usd: number;
  payment_status: string;
  payment_marked_at?: string;
  created_at: string;
}[] {
  const db = getDb();
  return db.prepare(
    'SELECT * FROM form_submissions ORDER BY id DESC LIMIT ?'
  ).all(limit) as {
    id: number;
    form_type: string;
    email: string;
    tg_username: string;
    tg_user_id?: string;
    screenshot_path: string;
    price_usd: number;
    payment_status: string;
    payment_marked_at?: string;
    created_at: string;
  }[];
}

export function getFormSubmissionById(id: number): {
  id: number;
  form_type: string;
  email: string;
  tg_username: string;
  tg_user_id?: string;
  screenshot_path: string;
  price_usd: number;
  payment_status: string;
  payment_marked_at?: string;
  created_at: string;
} | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM form_submissions WHERE id = ?').get(id) as {
    id: number;
    form_type: string;
    email: string;
    tg_username: string;
    tg_user_id?: string;
    screenshot_path: string;
    price_usd: number;
    payment_status: string;
    payment_marked_at?: string;
    created_at: string;
  } | undefined;
}

export function updateSubmissionStatus(id: number, status: 'paid' | 'unpaid' | 'pending'): void {
  const db = getDb();
  db.prepare(
    "UPDATE form_submissions SET payment_status = ?, payment_marked_at = datetime('now') WHERE id = ?"
  ).run(status, id);
}

export function getPaymentsSummary(): {
  paid_count: number;
  paid_total: number;
  unpaid_count: number;
  pending_count: number;
} {
  const db = getDb();
  const counts = db.prepare(`
    SELECT
      SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) AS paid_count,
      SUM(CASE WHEN payment_status = 'unpaid' THEN 1 ELSE 0 END) AS unpaid_count,
      SUM(CASE WHEN payment_status = 'pending' THEN 1 ELSE 0 END) AS pending_count,
      SUM(CASE WHEN payment_status = 'paid' THEN price_usd ELSE 0 END) AS paid_total
    FROM form_submissions
  `).get() as {
    paid_count: number | null;
    unpaid_count: number | null;
    pending_count: number | null;
    paid_total: number | null;
  };
  return {
    paid_count: counts.paid_count || 0,
    unpaid_count: counts.unpaid_count || 0,
    pending_count: counts.pending_count || 0,
    paid_total: counts.paid_total || 0,
  };
}

export function getBanners(carouselId = 'feature'): {
  id: number;
  carousel_id: string;
  image_path: string;
  order_index: number;
  enabled: number;
}[] {
  const db = getDb();
  return db.prepare(
    'SELECT * FROM banners WHERE carousel_id = ? AND enabled = 1 ORDER BY order_index'
  ).all(carouselId) as {
    id: number;
    carousel_id: string;
    image_path: string;
    order_index: number;
    enabled: number;
  }[];
}

export function getAllBanners(): {
  id: number;
  carousel_id: string;
  image_path: string;
  order_index: number;
  enabled: number;
}[] {
  const db = getDb();
  return db.prepare('SELECT * FROM banners ORDER BY carousel_id, order_index').all() as {
    id: number;
    carousel_id: string;
    image_path: string;
    order_index: number;
    enabled: number;
  }[];
}

export function addBanner(carouselId: string, imagePath: string, orderIndex: number): number {
  const db = getDb();
  const result = db.prepare(
    'INSERT INTO banners (carousel_id, image_path, order_index) VALUES (?, ?, ?)'
  ).run(carouselId, imagePath, orderIndex);
  return Number(result.lastInsertRowid);
}

export function deleteBanner(id: number): void {
  const db = getDb();
  db.prepare('DELETE FROM banners WHERE id = ?').run(id);
}

export function updateBannerOrder(updates: { id: number; order_index: number }[]): void {
  const db = getDb();
  const stmt = db.prepare('UPDATE banners SET order_index = ? WHERE id = ?');
  for (const { id, order_index } of updates) {
    stmt.run(order_index, id);
  }
}

export function addAnalyticsEvent(data: {
  event_type: 'page_view' | 'click' | 'time_spent' | 'session_start';
  path?: string;
  session_id?: string;
  event_label?: string;
  duration_ms?: number;
  country_code?: string;
  metadata?: Record<string, unknown>;
  user_agent?: string;
  referrer?: string;
}): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO analytics_events
      (event_type, path, session_id, event_label, duration_ms, country_code, metadata, user_agent, referrer)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    data.event_type,
    data.path || null,
    data.session_id || null,
    data.event_label || null,
    data.duration_ms || 0,
    data.country_code || null,
    data.metadata ? JSON.stringify(data.metadata) : null,
    data.user_agent || null,
    data.referrer || null
  );
}

/** Исключаем трафик админки из всех отчётов (path /admin и /admin/*). */
const ADMIN_PATH_FILTER = " (path IS NULL OR (path != '/admin' AND path NOT LIKE '/admin/%')) ";

/** Уникальные посетители = разные session_id. Просмотры всего = каждый заход на страницу. Уникальные просмотры = пары (сессия, страница) без повторов. */
export function getAnalyticsSummary(): {
  unique_visitors: number;
  total_page_views: number;
  unique_page_views: number;
  total_clicks: number;
  total_time_ms: number;
  bot_users: number;
} {
  const db = getDb();
  const totals = db.prepare(`
    SELECT
      COUNT(DISTINCT session_id) AS unique_visitors,
      SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) AS total_page_views,
      SUM(CASE WHEN event_type = 'click' THEN 1 ELSE 0 END) AS total_clicks,
      SUM(CASE WHEN event_type = 'time_spent' THEN duration_ms ELSE 0 END) AS total_time_ms
    FROM analytics_events
    WHERE ${ADMIN_PATH_FILTER}
  `).get() as {
    unique_visitors: number | null;
    total_page_views: number | null;
    total_clicks: number | null;
    total_time_ms: number | null;
  };
  const uniquePv = db.prepare(`
    SELECT COUNT(DISTINCT session_id || '|' || COALESCE(path, '')) AS cnt
    FROM analytics_events
    WHERE event_type = 'page_view' AND ${ADMIN_PATH_FILTER}
  `).get() as { cnt: number | null };
  const botUsers = db.prepare(`SELECT COUNT(*) AS cnt FROM bot_users`).get() as { cnt: number };
  return {
    unique_visitors: totals.unique_visitors || 0,
    total_page_views: totals.total_page_views || 0,
    unique_page_views: uniquePv?.cnt || 0,
    total_clicks: totals.total_clicks || 0,
    total_time_ms: totals.total_time_ms || 0,
    bot_users: botUsers?.cnt || 0,
  };
}

export function getTopCountries(limit = 10): {
  country_code: string;
  visitors: number;
}[] {
  const db = getDb();
  return db.prepare(`
    SELECT country_code, COUNT(DISTINCT session_id) AS visitors
    FROM analytics_events
    WHERE country_code IS NOT NULL AND country_code != '' AND ${ADMIN_PATH_FILTER}
    GROUP BY country_code
    ORDER BY visitors DESC
    LIMIT ?
  `).all(limit) as { country_code: string; visitors: number }[];
}

export function getCountryFromCache(ip: string): string | null {
  const db = getDb();
  const row = db.prepare(
    'SELECT country_code FROM ip_geo_cache WHERE ip = ?'
  ).get(ip) as { country_code: string } | undefined;
  return row?.country_code || null;
}

export function upsertCountryCache(ip: string, countryCode: string): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO ip_geo_cache (ip, country_code)
     VALUES (?, ?)
     ON CONFLICT(ip) DO UPDATE SET country_code = excluded.country_code, updated_at = datetime('now')`
  ).run(ip, countryCode);
}

export function getTopClicks(limit = 10): {
  event_label: string;
  path: string;
  clicks: number;
}[] {
  const db = getDb();
  return db.prepare(`
    SELECT event_label, path, COUNT(*) AS clicks
    FROM analytics_events
    WHERE event_type = 'click'
      AND event_label IS NOT NULL
      AND event_label != ''
      AND ${ADMIN_PATH_FILTER}
    GROUP BY event_label, path
    ORDER BY clicks DESC
    LIMIT ?
  `).all(limit) as { event_label: string; path: string; clicks: number }[];
}

export function getPageStats(): {
  path: string;
  page_views: number;
  unique_visitors: number;
  time_ms: number;
}[] {
  const db = getDb();
  return db.prepare(`
    SELECT
      path,
      SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) AS page_views,
      COUNT(DISTINCT CASE WHEN event_type = 'page_view' THEN session_id END) AS unique_visitors,
      SUM(CASE WHEN event_type = 'time_spent' THEN duration_ms ELSE 0 END) AS time_ms
    FROM analytics_events
    WHERE path IS NOT NULL AND path != '' AND path != '/admin' AND path NOT LIKE '/admin/%'
    GROUP BY path
    ORDER BY page_views DESC
  `).all() as { path: string; page_views: number; unique_visitors: number; time_ms: number }[];
}

export function getAnalyticsEvents(limit = 10000): {
  id: number;
  event_type: string;
  path: string | null;
  session_id: string | null;
  event_label: string | null;
  duration_ms: number;
  country_code: string | null;
  metadata: string | null;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
}[] {
  const db = getDb();
  return db.prepare(
    `SELECT * FROM analytics_events WHERE ${ADMIN_PATH_FILTER} ORDER BY id DESC LIMIT ?`
  ).all(limit) as {
    id: number;
    event_type: string;
    path: string | null;
    session_id: string | null;
    event_label: string | null;
    duration_ms: number;
    country_code: string | null;
    metadata: string | null;
    user_agent: string | null;
    referrer: string | null;
    created_at: string;
  }[];
}

export function upsertBotUser(data: {
  tg_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO bot_users (tg_id, username, first_name, last_name)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(tg_id) DO UPDATE SET
       username = excluded.username,
       first_name = excluded.first_name,
       last_name = excluded.last_name,
       last_seen_at = datetime('now')`
  ).run(
    data.tg_id,
    data.username || null,
    data.first_name || null,
    data.last_name || null
  );
}
