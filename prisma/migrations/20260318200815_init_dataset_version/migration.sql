-- CreateTable
CREATE TABLE "DatasetVersion" (
    "id" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "source" TEXT,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "DatasetVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DatasetVersion_reference_key" ON "DatasetVersion"("reference");
