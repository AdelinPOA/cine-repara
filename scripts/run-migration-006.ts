import { sql } from '@/lib/db';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigration() {
  try {
    console.log('Running migration 006: Fix Incomplete Profiles...\n');

    // Read migration file
    const migrationPath = join(process.cwd(), 'src/lib/db/migrations/006_fix_incomplete_profiles.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    // Split by semicolon to get individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    // Execute UPDATE statement
    const updateStatement = statements[0];
    console.log('Executing UPDATE statement...');
    const updateResult = await sql.query(updateStatement);
    console.log(`✅ Updated ${updateResult.rowCount} profile(s)\n`);

    // Execute SELECT statement to show results
    const selectStatement = statements[1];
    console.log('Checking results...');
    const selectResult = await sql.query(selectStatement);
    console.log('Results:', selectResult.rows[0]);

    console.log('\n✅ Migration 006 completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runMigration();
