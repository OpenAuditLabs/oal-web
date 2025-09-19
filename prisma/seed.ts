import { PrismaClient, AuditStatus, SeverityLevel } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { randomInt } from 'crypto'
import * as bcrypt from 'bcrypt'


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
function generateProgress(status: AuditStatus): number | null {
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
  await prisma.file.deleteMany()
  await prisma.audit.deleteMany()
  await prisma.project.deleteMany()
  await prisma.credit.deleteMany()
  await prisma.user.deleteMany()
  console.log('🧹 Cleared existing data')
  
  // Ensure a demo user with a starting credit balance
  const demoEmail = process.env.DEMO_USER_EMAIL || 'demo@oal.local'
  const demoPassword = bcrypt.hashSync('Demo@1234', 12)
  const demoUser = await prisma.user.create({
    data: {
      email: demoEmail,
      name: 'Demo User',
      password: demoPassword
    }
  })
  await prisma.credit.create({ data: { userId: demoUser.id, balance: randomInt(100, 1000) } })

  // Create projects first (ensure unique names)
  const shuffledTypes = faker.helpers.shuffle(projectTypes)
  const selectedTypes = shuffledTypes.slice(0, 6)
  // Initialize projects with fileCount = 0; will update after creating related File records
  const projects = selectedTypes.map(name => ({
    name,
    description: faker.company.catchPhrase(),
    fileCount: 0,
    ownerId: demoUser.id,
  }))

  const createdProjects = await Promise.all(projects.map(project => prisma.project.create({ data: project })))
  console.log(`✅ Created ${createdProjects.length} projects`)
  // Create files for each project (simulate repository files)
  const allFiles: Record<string, string[]> = {}
  for (const project of createdProjects) {
    const fileTotal = faker.number.int({ min: 8, max: 20 })
    const exts = ['js','ts','tsx','py','java','php']
    const created = [] as string[]
    for (let i=0;i<fileTotal;i++) {
      const ext = faker.helpers.arrayElement(exts)
      const name = faker.helpers.slugify(faker.hacker.noun()+ '-' + faker.number.int({min:1,max:999})) + '.' + ext
      const file = await prisma.file.create({
        data: {
          projectId: project.id,
          name,
          path: `src/${name}`,
          language: ext,
          sizeBytes: faker.number.int({ min: 200, max: 25000 })
        }
      })
      created.push(file.id)
    }
    allFiles[project.id] = created
    // Update project's denormalized fileCount to reflect actual number of File rows
    await prisma.project.update({
      where: { id: project.id },
      data: { fileCount: fileTotal }
    })
    // Also update local object so subsequent audit seeding has correct fileCount value
    ;(project as any).fileCount = fileTotal
  }
  console.log('✅ Created files for projects')
  
  // Create audits with findings
  const audits = []
  for (const project of createdProjects) {
    // Create 2-4 audits per project
    const auditCount = faker.number.int({ min: 5, max: 24 })
    
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
          
          const fileIds = allFiles[project.id]
          const fileId = faker.helpers.arrayElement(fileIds)
          await prisma.finding.create({
            data: {
              auditId: audit.id,
              fileId,
              title: `${faker.helpers.arrayElement(findingCategories)} Vulnerability`,
              description: faker.lorem.sentences(2),
              severity,
              category: faker.helpers.arrayElement(findingCategories),
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
  
  // Generate active (IN_PROGRESS / QUEUED) audits directly now that Activity model is removed
  let activeCount = 0
  for (const project of createdProjects) {
    const extraAudits = faker.number.int({ min: 0, max: 2 })
    for (let i = 0; i < extraAudits; i++) {
      const status = faker.helpers.arrayElement(['IN_PROGRESS', 'QUEUED'] as AuditStatus[])
      const progressVal = generateProgress(status)
      await prisma.audit.create({
        data: {
          projectId: project.id,
            projectName: project.name,
          size: generateFileSize(),
          status,
          progress: progressVal,
          fileCount: project.fileCount,
        }
      })
      activeCount++
    }
  }
  console.log(`✅ Created ${activeCount} active/queued audits`)
  
  // Display summary
  const auditStatusCounts = await prisma.audit.groupBy({
    by: ['status'],
    _count: {
      status: true,
    },
  })
  
  console.log('\n📊 Audit Summary:')
  auditStatusCounts.forEach(({ status, _count }: any) => {
    console.log(`   ${status}: ${_count.status} audits`)
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
