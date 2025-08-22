/*
  Warnings:

  - You are about to drop the column `sourceApi` on the `ReferenceDrugCache` table. All the data in the column will be lost.
  - You are about to alter the column `unitPrice` on the `ReferenceDrugCache` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to drop the column `details` on the `ValidationResult` table. All the data in the column will be lost.
  - You are about to drop the column `recordedValue` on the `ValidationResult` table. All the data in the column will be lost.
  - You are about to drop the `Setting` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `unitPrice` on the ReferenceDrugCache table required. This step will fail if there are existing NULL values in the column.
  - Added the required column `totalRows` to the `Validation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Validation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualValue` to the `ValidationResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `ValidationResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `ValidationResult` table without a default value. This is not possible if the table is not empty.

*/

-- DropIndex
DROP INDEX "ValidationResult_validationId_idx";

-- AlterTable
ALTER TABLE "ReferenceDrugCache" DROP COLUMN "sourceApi",
ALTER COLUMN "unitPrice" SET NOT NULL,
ALTER COLUMN "unitPrice" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Validation" ADD COLUMN     "totalRows" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "ValidationResult" DROP COLUMN "details",
DROP COLUMN "recordedValue",
ADD COLUMN     "actualValue" TEXT NOT NULL DEFAULT 'N/A',
ADD COLUMN     "formulation" TEXT,
ADD COLUMN     "message" TEXT NOT NULL DEFAULT 'Discrepancy detected',
ADD COLUMN     "payer" TEXT,
ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "strength" TEXT,
ADD COLUMN     "unitPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- DropTable
DROP TABLE "Setting";
