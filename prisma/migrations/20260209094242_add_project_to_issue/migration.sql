/*
  Warnings:

  - Added the required column `project` to the `issues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "issues" ADD COLUMN     "project" TEXT NOT NULL;
