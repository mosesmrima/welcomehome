-- Fix: Drop and recreate property_type check constraint
-- The existing constraint might have different values or wrong type

-- Step 1: Find and drop the existing constraint
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Find the constraint name
    SELECT con.conname INTO constraint_name
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    WHERE rel.relname = 'properties'
    AND con.conname LIKE '%property_type%'
    LIMIT 1;

    -- Drop it if it exists
    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE properties DROP CONSTRAINT %I', constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END IF;
END $$;

-- Step 2: Ensure column exists as TEXT (not enum)
DO $$
BEGIN
    -- Check if column exists and alter if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'properties' AND column_name = 'property_type'
    ) THEN
        -- Make sure it's TEXT type
        ALTER TABLE properties ALTER COLUMN property_type TYPE TEXT;
    ELSE
        -- Add column if it doesn't exist
        ALTER TABLE properties ADD COLUMN property_type TEXT;
    END IF;
END $$;

-- Step 3: Add the correct check constraint
ALTER TABLE properties
ADD CONSTRAINT properties_property_type_check
CHECK (property_type IN ('residential', 'commercial', 'land', 'industrial', 'mixed_use'));

-- Step 4: Do the same for size_unit
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    SELECT con.conname INTO constraint_name
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    WHERE rel.relname = 'properties'
    AND con.conname LIKE '%size_unit%'
    LIMIT 1;

    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE properties DROP CONSTRAINT %I', constraint_name);
    END IF;
END $$;

ALTER TABLE properties
ADD CONSTRAINT properties_size_unit_check
CHECK (size_unit IN ('acres', 'sqm', 'sqft'));

-- Step 5: Do the same for status
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    SELECT con.conname INTO constraint_name
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    WHERE rel.relname = 'properties'
    AND con.conname LIKE '%status%'
    LIMIT 1;

    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE properties DROP CONSTRAINT %I', constraint_name);
    END IF;
END $$;

ALTER TABLE properties
ADD CONSTRAINT properties_status_check
CHECK (status IN ('available', 'sold_out', 'coming_soon'));

-- Verify the constraints
SELECT
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'properties'::regclass
AND conname LIKE '%check%'
ORDER BY conname;
