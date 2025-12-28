/**
 * Database Migration Runner
 * Run with: npx tsx scripts/migrate.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '../.env.local') });

import { sql } from '@/lib/db';
import { readFileSync } from 'fs';
import { join } from 'path';

const MIGRATIONS_DIR = join(__dirname, '../src/lib/db/migrations');

const migrations = [
  '001_initial_schema.sql',
  '002_seed_categories.sql',
  '003_seed_locations.sql',
];

async function runMigrations() {
  console.log('🚀 Starting database migrations...\n');

  for (const migration of migrations) {
    try {
      console.log(`📄 Running: ${migration}`);
      const filePath = join(MIGRATIONS_DIR, migration);
      const sqlContent = readFileSync(filePath, 'utf-8');

      // Execute the SQL
      await sql.query(sqlContent);

      console.log(`✅ Completed: ${migration}\n`);
    } catch (error) {
      console.error(`❌ Failed: ${migration}`);
      console.error(error);
      process.exit(1);
    }
  }

  console.log('🎉 All migrations completed successfully!');
  process.exit(0);
}

runMigrations();
