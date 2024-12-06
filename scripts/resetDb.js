const { db } = require('../src/services/database/db');

async function resetDatabase() {
  try {
    console.log('Clearing database...');
    await db.clearAllData();
    console.log('Database reset successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to reset database:', error);
    process.exit(1);
  }
}

resetDatabase();