import { NextResponse } from 'next/server';
import { getAllConfig } from '@/lib/db';

// Public config endpoint (read-only, no auth needed)
// Returns only safe config keys for the payment UI
const PUBLIC_KEYS = [
  'price_current', 'price_old',
  'wallet_erc20', 'wallet_bep20', 'wallet_trc20',
  'selly_url', 'support_username',
  'cis_russia_exchangers', 'cis_ukraine_exchangers', 'cis_kazakhstan_exchangers',
  'cis_russia_amount', 'cis_ukraine_amount', 'cis_kazakhstan_amount',
];

export async function GET() {
  const all = getAllConfig();
  const filtered = all.filter((c) => PUBLIC_KEYS.includes(c.key));
  return NextResponse.json(filtered);
}
