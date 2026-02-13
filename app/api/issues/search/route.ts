import { issueRepo } from "@/composition/container";
import { makeSearchIssuesHandlers } from "@/delivery/http/handlers/searchIssues";

export const { GET } = makeSearchIssuesHandlers({issueRepo});