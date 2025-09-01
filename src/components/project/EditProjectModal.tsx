"use client";

import React, { useRef, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { updateProject } from "@/actions/projects";

interface EditProjectModalProps {
  open: boolean;
  onClose: () => void;
  project: { id: string; name: string; description: string | null } | null;
}

export default function EditProjectModal({ open, onClose, project }: EditProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || "");
    }
  }, [project]);

  if (!open || !project) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  const handleFormSubmit = () => {
    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/80"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-lg shadow-lg p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        <form className="space-y-4" action={updateProject} onSubmit={handleFormSubmit}>
          <input type="hidden" name="id" value={project.id} />
          <div>
            <label className="block text-sm font-medium mb-1">Project Name</label>
            <input
              type="text"
              name="name"
              className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter project name"
              value={name}
              onChange={e => setName(e.target.value)}
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
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="secondary" size="md" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
