/*
  Warnings:

  - Added the required column `organization_id` to the `issues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "issues" ADD COLUMN     "organization_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "issues_organization_id_idx" ON "issues"("organization_id");
