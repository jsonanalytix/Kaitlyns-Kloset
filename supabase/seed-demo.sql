-- Standalone seed script for the demo account.
--
-- Prerequisites:
--   1. Run all migrations (001–006) first
--   2. Create the demo user in Supabase Auth with email: demo@kaitlynskloset.app
--      (via the Supabase dashboard or Auth API)
--
-- This script calls the reset_demo_account() function created by migration 006,
-- which deletes any existing demo data and re-inserts the full demo dataset.

SELECT public.reset_demo_account();
