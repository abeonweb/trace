-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('open', 'resolved');

-- CreateTable
CREATE TABLE "issues" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "IssueStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resolutions" (
    "issue_id" TEXT NOT NULL,
    "root_cause" TEXT NOT NULL,
    "prevention" TEXT NOT NULL,
    "resolved_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resolutions_pkey" PRIMARY KEY ("issue_id")
);

-- CreateTable
CREATE TABLE "issue_contexts" (
    "id" TEXT NOT NULL,
    "issue_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "issue_contexts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "resolutions" ADD CONSTRAINT "resolutions_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_contexts" ADD CONSTRAINT "issue_contexts_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "issues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX issues_search_idx
ON issues
USING GIN (
  to_tsvector('english', title || ' ' || description)
);