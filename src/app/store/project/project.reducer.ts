import * as project from './project.actions';
import * as globalActions from '../global.actions';
import { Project } from 'src/app/shared/models/Project';
import { ProjectsState } from './project.state';

export const initialProjectState: ProjectsState = {
    projects: [],
    limitReached: false,
    active: new Project(),
    success: false
};

export function projectReducer(state = initialProjectState, action: project.ProjectActions): ProjectsState {
    switch (action.type) {

        case project.LOAD_ALL_PROJECTS_SUCCESS:
            const stateAllProjectsLoaded = Object.assign({}, state);
            stateAllProjectsLoaded.projects = (action.payload as Project[]);
            return stateAllProjectsLoaded;
        case project.ADD_PROJECT_SUCCESS:
            const stateToReturn = Object.assign({}, state);
            stateToReturn.projects.push((action.payload as Project));
            stateToReturn.active = (action.payload as Project);
            stateToReturn.success = true;
            stateToReturn.limitReached = false;
            return stateToReturn;
        case project.ADD_PROJECT_SUCCESS_AI:
                const stateAIToReturn = Object.assign({}, state);
                stateAIToReturn.projects.push((action.payload as Project));
                stateAIToReturn.active = (action.payload as Project);
                stateAIToReturn.success = true;
                stateAIToReturn.limitReached = false;
            return stateAIToReturn;    

        case project.UPDATE_PROJECT_SUCCESS:
            const stateActiveUpdated = Object.assign({}, state);
            stateActiveUpdated.active = (action.payload as Project);
            const index = stateActiveUpdated.projects.findIndex(x => x.id === (action.payload as Project).id);
            stateActiveUpdated.projects[index] = (action.payload as Project);
            stateActiveUpdated.active = (action.payload as Project);
            stateActiveUpdated.success = true;
            stateActiveUpdated.limitReached = false;
            return stateActiveUpdated;

        case project.DELETE_PROJECT_SUCCESS:
            const stateAfterDelete = Object.assign({}, state);
            stateAfterDelete.projects = stateAfterDelete.projects.filter((proj) => proj.id !== action.payload);
            stateAfterDelete.limitReached = false;
            if (stateAfterDelete.projects.length > 0) {
                stateAfterDelete.active = stateAfterDelete.projects[stateAfterDelete.projects.length - 1];
            } else {
                stateAfterDelete.active = new Project();
            }
            return stateAfterDelete;

        case globalActions.EFFECT_ERROR:
            return Object.assign({}, state);

        default:
            return state;
    }
}
