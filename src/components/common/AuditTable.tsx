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
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "failed":
        return <CircleX className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getActionIcons = (status: string) => {
    if (status === "completed") {
      return (
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Project</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Size</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Severity</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Findings</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Duration</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Completed</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {audits.map((audit) => (
              <tr key={audit.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {audit.project}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {audit.size}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(audit.status)}
                    <span className="text-sm text-gray-600 capitalize">
                      {audit.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {audit.severity}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {audit.findings}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {audit.duration}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
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
