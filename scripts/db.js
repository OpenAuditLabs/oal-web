#!/usr/bin/env node

/**
 * Database Management Scripts
 * 
 * Usage:
 * - npm run db:seed         # Seed with fake data
 * - npm run db:reset        # Reset and reseed database
 * - npm run db:fresh        # Fresh migration + seed
 */

const { execSync } = require('child_process');

const command = process.argv[2];

function runCommand(cmd, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

switch (command) {
  case 'reset':
    runCommand('npx prisma migrate reset --force', 'Resetting database');
    runCommand('npm run db:seed', 'Seeding database');
    break;
    
  case 'fresh':
    runCommand('npx prisma migrate dev', 'Running migrations');
    runCommand('npm run db:seed', 'Seeding database');
    break;
    
  case 'status':
    runCommand('npx prisma migrate status', 'Checking migration status');
    break;
    
  default:
    console.log(`
Database Management Commands:

  npm run db:reset    - Reset database and reseed
  npm run db:fresh    - Fresh migration and seed  
  npm run db:status   - Check migration status
  npm run db:seed     - Seed database with fake data
  
  npx prisma studio   - Open Prisma Studio
  npx prisma migrate dev - Run migrations
    `);
}
