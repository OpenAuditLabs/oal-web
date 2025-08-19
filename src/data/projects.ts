import projectsJson from './projects.json';

export interface Project {
  id: string;
  title: string;
  description: string;
  fileCount: number;
  date: string;
}

export const projectsData: Project[] = projectsJson as Project[];
