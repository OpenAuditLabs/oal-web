"use client"
import { 
  Edit, 
  Trash2, 
  FileText, 
  Calendar,
  Download,
  Play
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useTransition, useState, useRef, useEffect, useCallback } from 'react';
import { deleteProjectAction } from '@/actions/projects';

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
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteBtnRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const handleDocumentClick = useCallback((e: MouseEvent) => {
    if (!showConfirm) return;
    const target = e.target as Node;
    if (popoverRef.current && popoverRef.current.contains(target)) return;
    if (deleteBtnRef.current && deleteBtnRef.current.contains(target)) return;
    setShowConfirm(false);
  }, [showConfirm]);

  useEffect(() => {
    if (showConfirm) {
      document.addEventListener('mousedown', handleDocumentClick);
    } else {
      document.removeEventListener('mousedown', handleDocumentClick);
    }
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [showConfirm, handleDocumentClick]);

  const beginDelete = () => {
    if (isPending) return;
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setError(null);
    startTransition(async () => {
      const res = await deleteProjectAction(id);
      if (!res.deleted) {
        setError(res.error || 'Failed to delete');
        setShowConfirm(false);
        return;
      }
      onDelete?.(id);
      // No need to hide confirm since card will likely unmount; fallback hide
      setShowConfirm(false);
    });
  };

  const cancelDelete = () => {
    if (isPending) return; 
    setShowConfirm(false);
  };
  return (
    <div className="bg-secondary rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow max-w-sm relative">
      {error && (
        <div className="absolute -top-2 right-2 bg-destructive/10 text-destructive text-xs px-2 py-1 rounded">
          {error}
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground flex-1 pr-2">{title}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit?.(id)}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            title={isPending ? 'Please wait' : 'Edit project'}
            disabled={isPending}
          >
            <Edit className="w-4 h-4" />
          </button>
          <div className="relative inline-block">
            <button
              ref={deleteBtnRef}
              onClick={beginDelete}
              className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
              title={isPending ? 'Deleting...' : 'Delete project'}
              disabled={isPending}
              aria-haspopup="dialog"
              aria-expanded={showConfirm}
              aria-controls={showConfirm ? `project-delete-popover-${id}` : undefined}
            >
              <Trash2 className={`w-4 h-4 ${isPending ? 'animate-pulse' : ''}`} />
            </button>
            {showConfirm && (
              <div
                ref={popoverRef}
                id={`project-delete-popover-${id}`}
                role="dialog"
                aria-modal="false"
                className="absolute right-0 mt-2 w-64 z-30 rounded-md border border-border bg-popover shadow-lg p-4 animate-in fade-in-0 zoom-in-95"
              >
                <p className="text-sm font-medium text-foreground mb-2">Delete this project?</p>
                <p className="text-xs text-muted-foreground mb-3">This will remove the project and its audits. This action cannot be undone.</p>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={cancelDelete}
                    className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
                    disabled={isPending}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    className="px-2 py-1 text-xs rounded-md bg-destructive text-white hover:bg-destructive/90 disabled:opacity-50"
                    disabled={isPending}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-foreground text-sm mb-4 line-clamp-2">{description}</p>

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


      <div className="flex items-center gap-2">
        <Button
          onClick={() => onAddFiles?.(id)}
          variant="primary"
          size="sm"
          icon={Download}
          className="flex-1 border-1 border-primary"
          disabled={isPending}
        >
          Add Files
        </Button>
        <Button
          onClick={() => onRunAudit?.(id)}
          variant="outline"
          size="sm"
          icon={Play}
          className="flex-1 !text-foreground hover:!text-white"
          disabled={isPending}
        >
          Run Audit
        </Button>
      </div>
    </div>
  );
}
