"use client";

import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { ProjectCard } from "@/components/project";

interface Project {
  id: string;
  name: string;
  description: string | null;
  fileCount: number;
  createdAt: Date;
  auditCount: number;
  _count: { audits: number };
}

interface ProjectsClientProps {
  projects: Project[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    
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
    console.log('Create new project');
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.name}
            description={project.description || "No description provided."}
            fileCount={project.fileCount}
            date={formatDate(new Date(project.createdAt))}
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
