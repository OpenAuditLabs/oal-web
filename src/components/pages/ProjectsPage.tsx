import Header from "@/components/common/Header";
import SearchAndFilter from "@/components/ui/SearchAndFilter";
import { getProjects } from "@/actions/projects";
import ProjectsClient from "@/components/project/ProjectsClient";

export default async function ProjectsPage(){
    const projectsData = await getProjects();

    return (
        <main className="flex-1 p-8">
            <Header 
                title="Projects"
                subtitle="Organize and manage your security audit projects"
            >
                <SearchAndFilter searchPlaceholder="Search projects..." />
            </Header>
            
            <ProjectsClient projects={projectsData} />
        </main>
    );
}
