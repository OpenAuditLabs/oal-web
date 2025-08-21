import { CheckCircle, CircleX, Eye, Download, RefreshCw } from "lucide-react";

interface AuditData {
  id: number;
  project: string;
  size: string;
  status: string;
  severity: string;
  findings: number;
  duration: string;
  completed: string;
}

interface AuditTableProps {
  audits: AuditData[];
}

export default function AuditTable({ audits }: AuditTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case "failed":
        return <CircleX className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getActionIcons = (status: string) => {
    if (status === "completed") {
      return (
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-secondary rounded">
            <Eye className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1 hover:bg-secondary rounded">
            <Download className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      );
    } else if (status === "failed") {
      return (
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-secondary rounded">
            <Eye className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1 hover:bg-secondary rounded">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      );
    }
  };

  return (
    <div className="bg-card rounded-lg border-2 border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Project</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Size</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Severity</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Findings</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Duration</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Completed</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {audits.map((audit) => (
              <tr key={audit.id} className="hover:bg-secondary/50">
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {audit.project}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {audit.size}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(audit.status)}
                    <span className="text-sm text-muted-foreground capitalize">
                      {audit.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {audit.severity}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {audit.findings}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {audit.duration}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {audit.completed}
                </td>
                <td className="px-6 py-4">
                  {getActionIcons(audit.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
