import * as teamActions from './team.actions';
import * as globalActions from '../global.actions';
import { TeamsState } from './team.state';


export const initialTeamState: TeamsState = {
    team: [],
    success: false,
};

export function teamReducer(state = initialTeamState, action: teamActions.TeamActions): TeamsState {
    switch (action.type) {
        case teamActions.UPDATE_TEAM_SUCCESS:
            const stateUpdated = Object.assign({}, state);
            stateUpdated.team[0] = (action.payload);
            return stateUpdated;

        case globalActions.EFFECT_ERROR:
            return Object.assign({}, state);

        default:
            return state;
    }
}
