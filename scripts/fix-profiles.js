// Simple Node.js script to execute migration 006
const { createPool } = require('@vercel/postgres');
const fs = require('fs');
const path = require('path');

// Load .env.local
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
  const pool = createPool({
    connectionString: process.env.POSTGRES_URL,
  });

  try {
    console.log('🔧 Running migration 006: Fix Incomplete Profiles...\n');

    // Execute UPDATE
    const updateResult = await pool.query(`
      UPDATE installer_profiles ip
      SET
        profile_completed = TRUE,
        updated_at = NOW()
      WHERE
        profile_completed = FALSE
        AND EXISTS (
          SELECT 1
          FROM installer_services
          WHERE installer_profile_id = ip.id
        )
        AND EXISTS (
          SELECT 1
          FROM installer_service_areas
          WHERE installer_profile_id = ip.id
        );
    `);

    console.log(`✅ Updated ${updateResult.rowCount} profile(s)\n`);

    // Show results
    const resultQuery = await pool.query(`
      SELECT
        COUNT(*) as total_completed,
        SUM(CASE WHEN profile_completed = TRUE THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN profile_completed = FALSE THEN 1 ELSE 0 END) as incomplete
      FROM installer_profiles;
    `);

    console.log('📊 Profile Status:');
    console.log(`   Total: ${resultQuery.rows[0].total_completed}`);
    console.log(`   Completed: ${resultQuery.rows[0].completed}`);
    console.log(`   Incomplete: ${resultQuery.rows[0].incomplete}`);
    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

runMigration();
