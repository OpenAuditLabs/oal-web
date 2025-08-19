import { 
  Edit, 
  Trash2, 
  FileText, 
  Calendar,
  Download,
  Play
} from "lucide-react";
import Button from "@/components/ui/Button";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  fileCount: number;
  date: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddFiles?: (id: string) => void;
  onRunAudit?: (id: string) => void;
}

export default function ProjectCard({
  id,
  title,
  description,
  fileCount,
  date,
  onEdit,
  onDelete,
  onAddFiles,
  onRunAudit
}: ProjectCardProps) {
  return (
    <div className="bg-secondary rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow max-w-sm">
      {/* Header with title and actions */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground flex-1 pr-2">{title}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit?.(id)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Edit project"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete?.(id)}
            className="text-muted-foreground hover:text-destructive transition-colors"
            title="Delete project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-foreground text-sm mb-4 line-clamp-2">{description}</p>

      {/* Project stats */}
      <div className="flex items-center justify-between mb-4 text-sm text-foreground">
        <div className="flex items-center gap-1">
          <FileText className="w-4 h-4" />
          <span>{fileCount} files</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{date}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onAddFiles?.(id)}
          variant="primary"
          size="sm"
          icon={Download}
          className="flex-1 border-1 border-primary"
        >
          Add Files
        </Button>
        <Button
          onClick={() => onRunAudit?.(id)}
          variant="outline"
          size="sm"
          icon={Play}
          className="flex-1 !text-foreground hover:!text-white"
        >
          Run Audit
        </Button>
      </div>
    </div>
  );
}
