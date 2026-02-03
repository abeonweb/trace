import { makeIssuesHandlers } from "@/delivery/http/handlers/issues";
import { issueRepo } from "@/composition/container";

export const { POST } = makeIssuesHandlers({ issueRepo });
