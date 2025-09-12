"use client";

import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { ProjectCard } from "@/components/project";
import ProjectDetailModal from '@/components/project/ProjectDetailModal';
import CreateProjectModal from "@/components/project/CreateProjectModal";
import EditProjectModal from "@/components/project/EditProjectModal";
import { useState, startTransition } from "react";
import AddFilesModal from '@/components/project/AddFilesModal';
import { runAuditAction } from '@/actions/run-audit';
import { toast } from 'sonner';

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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [projectBeingEdited, setProjectBeingEdited] = useState<Project | null>(null);
  const [addFilesOpen, setAddFilesOpen] = useState(false);
  const [projectForFiles, setProjectForFiles] = useState<Project | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailProject, setDetailProject] = useState<Project | null>(null);

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
    const proj = projects.find(p => p.id === id) || null;
    setProjectBeingEdited(proj);
    setEditModalOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    console.log(`Delete project ${id}`);
  };

  const handleAddFiles = (id: string) => {
  const proj = projects.find(p => p.id === id) || null;
  setProjectForFiles(proj);
  setAddFilesOpen(true);
  };

  const handleRunAudit = (id: string) => {
    const fd = new FormData();
    fd.set('projectId', id);
    startTransition(() => {
      runAuditAction(fd).then(() => {
        toast.success('Audit queued successfully');
      }).catch((err) => {
        console.error('Failed to queue audit', err);
        toast.error('Failed to start audit');
      });
    });
  };

  const handleOpenDetails = (id: string) => {
    const proj = projects.find(p => p.id === id) || null;
    setDetailProject(proj);
    if (proj) {
      setDetailOpen(true);
    } else {
      if (typeof toast === 'function') {
        toast.error?.('Project not found');
      } else {
        window.alert('Project not found');
      }
    }
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
      <EditProjectModal 
        open={editModalOpen} 
        onClose={() => { setEditModalOpen(false); setProjectBeingEdited(null); }} 
        project={projectBeingEdited}
      />
      <AddFilesModal 
        open={addFilesOpen}
        onClose={() => { setAddFilesOpen(false); setProjectForFiles(null); }}
        project={projectForFiles ? { id: projectForFiles.id, name: projectForFiles.name } : null }
      />
      <ProjectDetailModal
        open={detailOpen}
        onClose={() => { setDetailOpen(false); setDetailProject(null); }}
        project={detailProject ? {
          id: detailProject.id,
          name: detailProject.name,
          description: detailProject.description,
            fileCount: detailProject.fileCount,
          createdAt: detailProject.createdAt,
          auditCount: detailProject.auditCount ?? detailProject._count?.audits ?? 0,
        } : null}
      />
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
            onOpenDetails={handleOpenDetails}
          />
        ))}
      </div>
    </>
  );
}
