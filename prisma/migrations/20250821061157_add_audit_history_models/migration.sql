-- CreateEnum
CREATE TYPE "public"."audit_status" AS ENUM ('COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."severity_level" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterTable
ALTER TABLE "public"."activities" ADD COLUMN     "auditId" TEXT;

-- CreateTable
CREATE TABLE "public"."projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fileCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audits" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "status" "public"."audit_status" NOT NULL,
    "overallSeverity" "public"."severity_level",
    "findingsCount" INTEGER NOT NULL DEFAULT 0,
    "duration" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."findings" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "public"."severity_level" NOT NULL,
    "category" TEXT,
    "fileName" TEXT,
    "lineNumber" INTEGER,
    "remediation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "findings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."audits" ADD CONSTRAINT "audits_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."findings" ADD CONSTRAINT "findings_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "public"."audits"("id") ON DELETE CASCADE ON UPDATE CASCADE;
