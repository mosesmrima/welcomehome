-- Migration: Normalize all contract addresses to lowercase
-- This ensures consistency between blockchain (mixed case) and database (lowercase) addresses

-- Update all existing contract addresses to lowercase
UPDATE properties
SET contract_address = LOWER(contract_address)
WHERE contract_address != LOWER(contract_address);

-- Log the migration
DO $$
BEGIN
  RAISE NOTICE 'Contract addresses normalized to lowercase';
END $$;