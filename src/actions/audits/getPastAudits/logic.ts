import { PastAudit } from "@/types/audit";

export async function getPastAuditsLogic(): Promise<PastAudit[]> {
  // Simulate fetching past audits from a database
  return [
    { id: "1", title: "Audit X", createdAt: "2024-01-15", status: "completed" },
    { id: "2", title: "Audit Y", createdAt: "2024-02-20", status: "failed" },
    { id: "3", title: "Audit Z", createdAt: "2024-03-10", status: "completed" },
  ];
}
