import { issueRepo } from "@/composition/container";
import { makeIssuesHandlers } from "@/delivery/http/handlers/searchIssues";

export const { GET } = makeIssuesHandlers({issueRepo});