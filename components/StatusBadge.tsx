import { IssueDTO } from "@/types/issue";
import { Badge } from "./ui/badge";

export default function StatusBadge({
  status,
}: {
  status: IssueDTO["status"];
}) {
  return (
    <Badge variant={status === "resolved" ? "secondary" : "outline"}>
      {status}
    </Badge>
  );
}
