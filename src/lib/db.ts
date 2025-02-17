import { D1Database } from '@cloudflare/workers-types';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

declare global {
  var D1: D1Database | undefined;
}

export function getD1Client(): D1Database {
  if (!globalThis.D1) {
    throw new Error('D1 database not available');
  }
  return globalThis.D1;
}
