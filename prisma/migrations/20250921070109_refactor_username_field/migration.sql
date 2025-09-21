-- Step 1: Check if name is NULL for any users and update it to prevent errors
UPDATE "User" SET "name" = "email" WHERE "name" IS NULL;

-- Step 2: Update username with name values for any rows where username is already set to email
-- This will only update usernames that were automatically set to email during the previous migration
UPDATE "User" SET "username" = "name" WHERE "username" = "email";

-- Step 3: Since the data is now properly migrated, we'll keep the name field as nullable for display names
-- but it's now separate from username which is used for login