import { PastAudit } from "@/types/audit";
import prisma from "@/lib/prisma";
import { requireSessionUser } from "@/lib/session";
import { AuditStatus } from "@prisma/client";

export async function getPastAuditsLogic(): Promise<PastAudit[]> {
  const { user } = await requireSessionUser();

  const audits = await prisma.audit.findMany({
    where: {
      project: {
        ownerId: user.id,
      },
    },
    include: {
      project: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return audits.map((audit) => {
    let status: PastAudit["status"];
    switch (audit.status) {
      case AuditStatus.COMPLETED:
        status = "completed";
        break;
      case AuditStatus.FAILED:
        status = "failed";
        break;
      case AuditStatus.QUEUED:
      case AuditStatus.RUNNING:
        status = "pending";
        break;
      default:
        status = "pending"; // Default to pending for any unforeseen statuses
    }

    return {
      id: audit.id,
      title: audit.project.name,
      createdAt: audit.createdAt.toISOString().split("T")[0], // Format as YYYY-MM-DD
      status,
    };
  });
}
