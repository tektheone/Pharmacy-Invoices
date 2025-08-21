-- CreateTable
CREATE TABLE "Validation" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "processingTimeMs" INTEGER,
    "totalDiscrepancies" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Validation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationResult" (
    "id" TEXT NOT NULL,
    "validationId" TEXT NOT NULL,
    "drugName" TEXT NOT NULL,
    "discrepancyType" TEXT NOT NULL,
    "recordedValue" TEXT NOT NULL,
    "expectedValue" TEXT,
    "details" TEXT,
    "severity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ValidationResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceDrugCache" (
    "id" TEXT NOT NULL,
    "drugName" TEXT NOT NULL,
    "strength" TEXT,
    "formulation" TEXT,
    "unitPrice" DECIMAL(10,2),
    "payer" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceApi" TEXT,

    CONSTRAINT "ReferenceDrugCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "unitPriceThreshold" INTEGER NOT NULL DEFAULT 10,
    "cacheDurationHours" INTEGER NOT NULL DEFAULT 24,
    "fileSizeLimitBytes" INTEGER NOT NULL DEFAULT 104857600,
    "defaultExportFormat" TEXT NOT NULL DEFAULT 'pdf',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ValidationResult_validationId_idx" ON "ValidationResult"("validationId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferenceDrugCache_drugName_strength_formulation_key" ON "ReferenceDrugCache"("drugName", "strength", "formulation");

-- AddForeignKey
ALTER TABLE "ValidationResult" ADD CONSTRAINT "ValidationResult_validationId_fkey" FOREIGN KEY ("validationId") REFERENCES "Validation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
