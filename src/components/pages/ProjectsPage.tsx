import Header from "../common/Header";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { ProjectCard } from "../project";
import { projectsData } from "@/data/projects";

export default function ProjectsPage(){
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
        <main className="flex-1 p-8">
            <Header 
                title="Projects"
                subtitle="Organize and manage your security audit projects"
            />
            
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
                {projectsData.map((project) => (
                    <ProjectCard
                        key={project.id}
                        id={project.id}
                        title={project.title}
                        description={project.description}
                        fileCount={project.fileCount}
                        date={project.date}
                        onEdit={handleEditProject}
                        onDelete={handleDeleteProject}
                        onAddFiles={handleAddFiles}
                        onRunAudit={handleRunAudit}
                    />
                ))}
            </div>
        </main>
    );
}
