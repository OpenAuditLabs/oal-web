-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN "jwt_hash" TEXT;
COMMENT ON COLUMN "public"."users"."jwt_hash" IS 'SHA-256 hash of the latest JWT issued to this user';
-- NOTE: For full security, restrict access to this column via RLS/ACLs and exclude from default selects in application queries.
