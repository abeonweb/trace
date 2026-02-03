import { makeResolveIssueHandler } from "@/delivery/http/handlers/resolveIssue";
import { issueRepo, resolutionRepo } from "@/composition/container";

export const { POST } = makeResolveIssueHandler({ issueRepo, resolutionRepo });
