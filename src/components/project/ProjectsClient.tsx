"use client";

import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { ProjectCard } from "@/components/project";
import CreateProjectModal from "@/components/project/CreateProjectModal";
import { useState } from "react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  fileCount: number;
  createdAt: string | Date;
  auditCount: number;
  _count: { audits: number };
}

interface ProjectsClientProps {
  projects: Project[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const formatDate = (date: string | Date) => {
    const d = date instanceof Date ? date : new Date(date);
    const day = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'long' });
    const year = d.getFullYear();
    
    // Add ordinal suffix to day
    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
  };

  const handleEditProject = (id: string) => {
    console.log(`Edit project ${id}`);
  };

  const handleDeleteProject = (id: string) => {
    console.log(`Delete project ${id}`);
  };

  const handleAddFiles = (id: string) => {
    console.log(`Add files to project ${id}`);
  };

  const handleRunAudit = (id: string) => {
    console.log(`Run audit for project ${id}`);
  };

  const handleCreateProject = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div className="mb-8">
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={handleCreateProject}
        >
          Create a New Project
        </Button>
      </div>
      <CreateProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.name}
            description={project.description || "No description provided."}
            fileCount={project.fileCount}
            date={formatDate(project.createdAt)}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            onAddFiles={handleAddFiles}
            onRunAudit={handleRunAudit}
          />
        ))}
      </div>
    </>
  );
}
