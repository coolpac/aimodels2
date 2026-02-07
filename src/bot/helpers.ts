// Re-export DB functions used by bot
// This wrapper avoids direct db.ts import issues in edge/serverless

import { getBotMessage as _getBotMessage, getConfig as _getConfig } from '@/lib/db';
import { getAdminIds as _getAdminIds } from '@/lib/adminAuth';

export function getBotMessage(key: string): string {
  return _getBotMessage(key);
}

export function getConfig(key: string): string {
  return _getConfig(key);
}

export function getAdminIds(): number[] {
  return _getAdminIds();
}
