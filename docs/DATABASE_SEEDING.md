# Database Seeding Guide

This guide explains how to use the database seeding functionality with Faker.js to populate your development database with realistic fake data.

## Quick Start

```bash
# Seed the database with fake data
npm run db:seed

# Reset database and reseed
npm run db:reset

# Fresh migrations and seed
npm run db:fresh

# Check migration status
npm run db:status
```

## What Gets Seeded

The seeder creates 15 realistic activities with:

- **Project Names**: Common project types like "E-Commerce App", "Transport API", etc.
- **File Counts**: Random number between 5-150 files
- **File Sizes**: Realistic sizes in KB, MB, or GB
- **Status**: Distributed across IN_PROGRESS, QUEUED, COMPLETED, FAILED
- **Progress**: Contextual progress based on status (null for queued, 100 for completed, etc.)
- **Timestamps**: Recent activities from the last 30 days

## Seed Data Structure

```typescript
{
  title: "E-Commerce App",
  fileCount: 42,
  fileSize: "2.6 MB", 
  status: "IN_PROGRESS",
  progress: 69,
  createdAt: "2025-08-15T10:30:00Z"
}
```

## Usage in Components

The `RecentActivity` component now automatically fetches data from the database:

```tsx
// Automatically fetches from database
<RecentActivity />

// Or pass specific activities
<RecentActivity activities={customActivities} />
```

## API Endpoints

Access activities via REST API:

```bash
# Get 10 most recent activities
GET /api/activities

# Get specific number of activities  
GET /api/activities?limit=5
```

## Database Management

```bash
# View data in Prisma Studio
npx prisma studio

# Run specific migrations
npx prisma migrate dev

# Reset everything
npx prisma migrate reset
```

## Faker.js Features Used

- `faker.helpers.arrayElement()` - Random selection from arrays
- `faker.number.int()` - Random integers with ranges
- `faker.number.float()` - Random floats with precision
- `faker.date.recent()` - Recent dates within specified days

## Customizing Seed Data

Edit `prisma/seed.ts` to modify:

- Project names in the `projectTypes` array
- File size ranges and types
- Number of activities generated
- Status distribution
- Date ranges

## Development Workflow

1. Make schema changes in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_migration_name`
3. Update seed data in `prisma/seed.ts`
4. Run `npm run db:seed` to populate with fresh data
5. Test your components with realistic data

## Production Considerations

- Seeding is for development only
- Use environment variables to prevent seeding in production
- Consider using `DATABASE_URL` with different databases for dev/prod
- Backup important data before running reset commands
