"use client";

import React, { useRef } from "react";
import { createProject } from "@/actions/projects";
import Button from "@/components/ui/Button";
import { toast } from "sonner";

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  // Close modal when clicking outside content
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  // Submit form via server action, show toast, close on success
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    try {
      await createProject(fd);
      toast.success("Project created");
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create project';
      toast.error(msg);
    }
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/80"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-lg shadow-lg p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
  <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Project Name</label>
            <input
              type="text"
              name="name"
              className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter project name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter project description (optional)"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="secondary" size="md" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Create Project
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

