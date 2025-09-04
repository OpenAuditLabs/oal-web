-- Manual migration: merge Activity into Audit
-- 1. Extend audit_status enum if needed (add QUEUED, IN_PROGRESS, FAILED if missing)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'audit_status' AND e.enumlabel = 'QUEUED') THEN
    ALTER TYPE audit_status ADD VALUE IF NOT EXISTS 'QUEUED' BEFORE 'COMPLETED';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'audit_status' AND e.enumlabel = 'IN_PROGRESS') THEN
    ALTER TYPE audit_status ADD VALUE IF NOT EXISTS 'IN_PROGRESS' BEFORE 'COMPLETED';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'audit_status' AND e.enumlabel = 'FAILED') THEN
    -- FAILED likely already existed; safeguard
    ALTER TYPE audit_status ADD VALUE IF NOT EXISTS 'FAILED';
  END IF;
END$$;

-- 2. Add new columns to audits if they don't exist (quote camelCase)
ALTER TABLE "public"."audits" ADD COLUMN IF NOT EXISTS "progress" INTEGER;
ALTER TABLE "public"."audits" ADD COLUMN IF NOT EXISTS "fileCount" INTEGER;

-- If an earlier failed attempt created a lowercase filecount column, rename it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audits' AND column_name = 'filecount'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'audits' AND column_name = 'fileCount'
  ) THEN
    ALTER TABLE "public"."audits" RENAME COLUMN "filecount" TO "fileCount";
  END IF;
END$$;

-- 3. Migrate data from activities into audits
-- Assumption: activities.title maps to audits.projectName; attempt to match by projectName & size
-- If an audit with matching projectName & size & status not completed exists, update it, else create a new audit row.
-- NOTE: Complex matching may need application-level script; here we do best-effort insertion of orphan activities as new audits.

INSERT INTO "public"."audits" ("id", "projectId", "projectName", "size", "status", "findingsCount", "createdAt", "updatedAt", "progress", "fileCount")
SELECT a."id", p."id" as "projectId", a."title" as "projectName", a."fileSize" as "size",
       (CASE a."status"
         WHEN 'IN_PROGRESS' THEN 'IN_PROGRESS'
         WHEN 'QUEUED' THEN 'QUEUED'
         WHEN 'COMPLETED' THEN 'COMPLETED'
         WHEN 'FAILED' THEN 'FAILED'
       END)::audit_status as "status",
       0 as "findingsCount",
       a."createdAt", a."updatedAt", a."progress", a."fileCount"
FROM "public"."activities" a
LEFT JOIN "public"."projects" p ON p."name" = a."title"
WHERE NOT EXISTS (
  SELECT 1 FROM "public"."audits" au WHERE au."id" = a."id"
);

-- 4. Drop activities table
DROP TABLE IF EXISTS "public"."activities";

-- 5. Drop obsolete activity_status enum if exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_status') THEN
    -- Can't drop enum while dependent objects exist (handled by drop table above)
    DROP TYPE activity_status;
  END IF;
END$$;
