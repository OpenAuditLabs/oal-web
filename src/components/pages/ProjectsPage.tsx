import Header from "../common/Header";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function ProjectsPage(){
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
                    
                >
                    Add New Project
                </Button>
            </div>
        </main>

    );
}
