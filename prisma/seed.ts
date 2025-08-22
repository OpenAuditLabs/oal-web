import { PrismaClient, ActivityStatus, AuditStatus, SeverityLevel } from '@prisma/client'
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

// Common finding categories
const findingCategories = [
  'SQL Injection',
  'Cross-Site Scripting (XSS)',
  'Authentication Issues',
  'Authorization Flaws',
  'Data Exposure',
  'Input Validation',
  'Session Management',
  'Cryptographic Issues',
  'Business Logic Flaws',
  'Configuration Issues'
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

// Generate duration in MM:SS format
function generateDuration(): string {
  const minutes = faker.number.int({ min: 5, max: 120 })
  const seconds = faker.number.int({ min: 0, max: 59 })
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Calculate overall severity based on findings
function calculateOverallSeverity(severities: SeverityLevel[]): SeverityLevel {
  if (severities.includes('CRITICAL')) return 'CRITICAL'
  if (severities.includes('HIGH')) return 'HIGH'
  if (severities.includes('MEDIUM')) return 'MEDIUM'
  return 'LOW'
}

async function main() {
  console.log('🌱 Starting database seeding...')
  
  // Clear existing data
  await prisma.finding.deleteMany()
  await prisma.audit.deleteMany()
  await prisma.project.deleteMany()
  await prisma.activity.deleteMany()
  console.log('🧹 Cleared existing data')
  
  // Create projects first
  const projects = []
  for (let i = 0; i < 6; i++) {
    projects.push({
      name: faker.helpers.arrayElement(projectTypes),
      description: faker.company.catchPhrase(),
      fileCount: faker.number.int({ min: 50, max: 400 }),
    })
  }
  
  const createdProjects = await Promise.all(
    projects.map(project => prisma.project.create({ data: project }))
  )
  console.log(`✅ Created ${createdProjects.length} projects`)
  
  // Create audits with findings
  const audits = []
  for (const project of createdProjects) {
    // Create 2-4 audits per project
    const auditCount = faker.number.int({ min: 2, max: 4 })
    
    for (let i = 0; i < auditCount; i++) {
      const status = faker.helpers.arrayElement(['COMPLETED', 'FAILED'] as AuditStatus[])
      const completedAt = faker.date.past({ years: 1 })
      
      const audit = await prisma.audit.create({
        data: {
          projectId: project.id,
          projectName: project.name,
          size: generateFileSize(),
          status,
          duration: status === 'COMPLETED' ? generateDuration() : null,
          completedAt: status === 'COMPLETED' ? completedAt : null,
          findingsCount: 0, // Will be updated after creating findings
          overallSeverity: null, // Will be calculated after creating findings
        }
      })
      
      // Create findings for completed audits
      if (status === 'COMPLETED') {
        const findingsCount = faker.number.int({ min: 1, max: 8 })
        const findingSeverities: SeverityLevel[] = []
        
        for (let j = 0; j < findingsCount; j++) {
          const severity = faker.helpers.arrayElement(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as SeverityLevel[])
          findingSeverities.push(severity)
          
          await prisma.finding.create({
            data: {
              auditId: audit.id,
              title: `${faker.helpers.arrayElement(findingCategories)} Vulnerability`,
              description: faker.lorem.sentences(2),
              severity,
              category: faker.helpers.arrayElement(findingCategories),
              fileName: `${faker.system.fileName()}.${faker.helpers.arrayElement(['js', 'ts', 'php', 'java', 'py'])}`,
              lineNumber: faker.number.int({ min: 1, max: 500 }),
              remediation: faker.lorem.sentence(),
            }
          })
        }
        
        // Update audit with findings count and overall severity
        const overallSeverity = calculateOverallSeverity(findingSeverities)
        await prisma.audit.update({
          where: { id: audit.id },
          data: {
            findingsCount,
            overallSeverity,
          }
        })
      }
      
      audits.push(audit)
    }
  }
  
  console.log(`✅ Created ${audits.length} audits`)
  
  // Generate activities
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
      createdAt: faker.date.recent({ days: 30 }),
    })
  }
  
  const createdActivities = await prisma.activity.createMany({
    data: activities,
  })
  
  console.log(`✅ Created ${createdActivities.count} activities`)
  
  // Display summary
  const auditStatusCounts = await prisma.audit.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
  })
  
  const activityStatusCounts = await prisma.activity.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
  })
  
  console.log('\n📊 Audit Summary:')
  auditStatusCounts.forEach(({ status, _count }) => {
    console.log(`   ${status}: ${_count.status} audits`)
  })
  
  console.log('\n📊 Activity Summary:')
  activityStatusCounts.forEach(({ status, _count }) => {
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
