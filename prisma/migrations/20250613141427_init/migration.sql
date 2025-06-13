/*
  Warnings:

  - The values [TRIAL_EXPIRED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `maxConcurrentEvents` on the `Partner` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('ACTIVE', 'SUSPENDED');
ALTER TABLE "Partner" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Partner" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "Partner" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "maxConcurrentEvents";
