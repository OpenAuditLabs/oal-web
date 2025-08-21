import { PrismaClient, ActivityStatus } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

// Common project types for realistic naming
const projectTypes = [
  'E-Commerce App',
  'Transport API',
  'Banking System',
  'Social Media Platform',
  'Healthcare Dashboard',
  'Education Portal',
  'Real Estate App',
  'Food Delivery API',
  'Fitness Tracker',
  'Chat Application',
  'CRM System',
  'Analytics Dashboard',
  'Booking Platform',
  'Payment Gateway',
  'Inventory System'
]

// Generate realistic file sizes
function generateFileSize(): string {
  const sizeType = faker.helpers.arrayElement(['KB', 'MB', 'GB'])
  let size: number
  
  switch (sizeType) {
    case 'KB':
      size = faker.number.float({ min: 100, max: 999, fractionDigits: 1 })
      break
    case 'MB':
      size = faker.number.float({ min: 1, max: 500, fractionDigits: 1 })
      break
    case 'GB':
      size = faker.number.float({ min: 1, max: 10, fractionDigits: 1 })
      break
    default:
      size = faker.number.float({ min: 1, max: 100, fractionDigits: 1 })
  }
  
  return `${size} ${sizeType}`
}

// Generate realistic progress based on status
function generateProgress(status: ActivityStatus): number | null {
  switch (status) {
    case 'QUEUED':
      return null // Queued items don't have progress
    case 'IN_PROGRESS':
      return faker.number.int({ min: 1, max: 99 })
    case 'COMPLETED':
      return 100
    case 'FAILED':
      return faker.number.int({ min: 10, max: 80 }) // Failed at some point
    default:
      return null
  }
}

async function main() {
  console.log('🌱 Starting database seeding...')
  
  // Clear existing activities
  await prisma.activity.deleteMany()
  console.log('🧹 Cleared existing activities')
  
  // Generate 15 realistic activities
  const activities = []
  
  for (let i = 0; i < 15; i++) {
    const status = faker.helpers.arrayElement(['IN_PROGRESS', 'QUEUED', 'COMPLETED', 'FAILED'] as ActivityStatus[])
    const progress = generateProgress(status)
    
    activities.push({
      title: faker.helpers.arrayElement(projectTypes),
      fileCount: faker.number.int({ min: 5, max: 150 }),
      fileSize: generateFileSize(),
      status,
      progress,
      createdAt: faker.date.recent({ days: 30 }), // Activities from the last 30 days
    })
  }
  
  // Insert activities
  const createdActivities = await prisma.activity.createMany({
    data: activities,
  })
  
  console.log(`✅ Created ${createdActivities.count} activities`)
  
  // Display summary
  const statusCounts = await prisma.activity.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
  })
  
  console.log('\n📊 Activity Summary:')
  statusCounts.forEach(({ status, _count }) => {
    console.log(`   ${status}: ${_count.status} activities`)
  })
  
  console.log('\n🎉 Database seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
