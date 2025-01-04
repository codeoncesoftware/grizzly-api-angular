import { Project } from '../../shared/models/Project';

export interface ProjectsState {
    projects: Project[];
    limitReached: boolean;
    active: Project;
    success: boolean;
}
