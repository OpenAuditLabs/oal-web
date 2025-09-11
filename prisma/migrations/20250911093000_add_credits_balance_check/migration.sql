-- Add a CHECK constraint to enforce non-negative balance in credits
ALTER TABLE "public"."credits" ADD CONSTRAINT credits_balance_nonnegative CHECK (balance >= 0);

-- Down migration: remove the CHECK constraint
-- To rollback, run:
-- ALTER TABLE "public"."credits" DROP CONSTRAINT credits_balance_nonnegative;
