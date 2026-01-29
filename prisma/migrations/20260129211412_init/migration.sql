-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('open', 'resolved');

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "IssueStatus" NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resolution" (
    "id" TEXT NOT NULL,
    "rootCause" TEXT NOT NULL,
    "prevention" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,

    CONSTRAINT "Resolution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resolution_issueId_key" ON "Resolution"("issueId");

-- AddForeignKey
ALTER TABLE "Resolution" ADD CONSTRAINT "Resolution_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "Issue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
