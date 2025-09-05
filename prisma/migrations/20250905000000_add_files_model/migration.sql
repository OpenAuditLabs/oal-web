-- Create files table
CREATE TABLE "files" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  "projectId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "path" TEXT,
  "language" TEXT,
  "sizeBytes" INTEGER,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Index for projectId
CREATE INDEX "files_projectId_idx" ON "files" ("projectId");

-- Add nullable fileId column first to findings
ALTER TABLE "findings" ADD COLUMN "fileId" TEXT;

-- Create FK constraints
ALTER TABLE "files" ADD CONSTRAINT "files_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "findings" ADD CONSTRAINT "findings_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- (Optional) Data backfill step placeholder: associate existing findings with synthetic files if desired.
-- UPDATE logic would go here.

-- Drop legacy fileName column now that fileId replaces it.
ALTER TABLE "findings" DROP COLUMN "fileName";
