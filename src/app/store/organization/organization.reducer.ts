import * as organization from './organization.actions';
import * as globalActions from '../global.actions';
import { OrganizationsState } from './organization.state';



export const initialOrganizationState: OrganizationsState = {
    organization: [],
    success: false,

};

export function organizationReducer(state = initialOrganizationState, action: organization.OrganizationActions): OrganizationsState {
    switch (action.type) {



        case organization.LOAD_ALL_ORGANIZATIONS_SUCCESS:
            const stateOrganizationLoaded = Object.assign({}, state);
            stateOrganizationLoaded.organization = (action.payload as any[]);
            stateOrganizationLoaded.success = true;
            return stateOrganizationLoaded;

        case organization.ADD_ORGANIZATION_SUCCESS:
            const stateToReturn = Object.assign({}, state);
            stateToReturn.organization[0] = (action.payload);
            stateToReturn.success = true;
            return stateToReturn;


        case organization.UPDATE_ORGANIZATION_SUCCESS:
            const stateUpdated = Object.assign({}, state);
            stateUpdated.organization[0] = (action.payload);
            return stateUpdated;

        case organization.DEELTE_ORGANIZATION_SUCCESS:
            const newState = Object.assign({}, state);
            newState.organization.length = 0;
            return newState;

        case globalActions.EFFECT_ERROR:
            return Object.assign({}, state);

        default:
            return state;
    }
}
