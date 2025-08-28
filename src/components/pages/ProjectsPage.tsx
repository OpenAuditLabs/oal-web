import Header from "@/components/common/Header";
import { getProjects } from "@/actions/projects";
import { SearchProvider, SearchInput, SearchableProjectsList } from "@/components/project/ProjectSearchClient";

export default async function ProjectsPage(){
    const projectsData = await getProjects();

    return (
        <SearchProvider>
            <main className="flex-1 p-8">
                <Header 
                    title="Projects"
                    subtitle="Organize and manage your security audit projects"
                >
                    <SearchInput />
                </Header>
                <SearchableProjectsList projects={projectsData} />
            </main>
        </SearchProvider>
    );
}
