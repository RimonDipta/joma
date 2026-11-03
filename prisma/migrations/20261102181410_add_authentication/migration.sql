
-- Preserve the existing financial Account table and its data.
-- Rename it before creating the Auth.js Account table.

-- Drop foreign keys that need to be recreated against the renamed table.
ALTER TABLE "Account"
DROP CONSTRAINT "Account_currencyCode_fkey";

ALTER TABLE "Transaction"
DROP CONSTRAINT "Transaction_accountId_fkey";

ALTER TABLE "Transaction"
DROP CONSTRAINT "Transaction_transferAccountId_fkey";

-- Remove indexes whose names will change with the model rename.
DROP INDEX "Account_currencyCode_idx";
DROP INDEX "Account_userId_name_key";
DROP INDEX "Account_userId_type_idx";

-- Rename the existing financial Account table.
ALTER TABLE "Account" RENAME TO "FinancialAccount";

ALTER TABLE "FinancialAccount"
RENAME CONSTRAINT "Account_pkey" TO "FinancialAccount_pkey";

ALTER TABLE "FinancialAccount"
RENAME CONSTRAINT "Account_userId_fkey" TO "FinancialAccount_userId_fkey";

-- Update the existing user's email verification timestamp type.
ALTER TABLE "User"
ALTER COLUMN "emailVerified" SET DATA TYPE TIMESTAMPTZ(3);

-- Create Auth.js OAuth Account table.
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- Create Auth.js Session table.
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- Create Auth.js VerificationToken table.
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMPTZ(3) NOT NULL
);

-- Create indexes for Auth.js.
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key"
ON "Account"("provider", "providerAccountId");

CREATE INDEX "Account_userId_idx"
ON "Account"("userId");

CREATE UNIQUE INDEX "Session_sessionToken_key"
ON "Session"("sessionToken");

CREATE INDEX "Session_userId_idx"
ON "Session"("userId");

CREATE UNIQUE INDEX "VerificationToken_token_key"
ON "VerificationToken"("token");

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key"
ON "VerificationToken"("identifier", "token");

-- Recreate financial account indexes.
CREATE UNIQUE INDEX "FinancialAccount_userId_name_key"
ON "FinancialAccount"("userId", "name");

CREATE INDEX "FinancialAccount_userId_type_idx"
ON "FinancialAccount"("userId", "type");

CREATE INDEX "FinancialAccount_currencyCode_idx"
ON "FinancialAccount"("currencyCode");

-- Add foreign keys for Auth.js.
ALTER TABLE "Account"
ADD CONSTRAINT "Account_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Session"
ADD CONSTRAINT "Session_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- Restore financial account relationships.
ALTER TABLE "FinancialAccount"
ADD CONSTRAINT "FinancialAccount_currencyCode_fkey"
FOREIGN KEY ("currencyCode") REFERENCES "Currency"("code")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- Restore transaction relationships.
ALTER TABLE "Transaction"
ADD CONSTRAINT "Transaction_accountId_fkey"
FOREIGN KEY ("accountId") REFERENCES "FinancialAccount"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Transaction"
ADD CONSTRAINT "Transaction_transferAccountId_fkey"
FOREIGN KEY ("transferAccountId") REFERENCES "FinancialAccount"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
