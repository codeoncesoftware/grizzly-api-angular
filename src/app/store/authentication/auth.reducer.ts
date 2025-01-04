import { User } from 'src/app/shared/models/User';
import { AuthState } from './auth.state';
import * as authActions from './auth.actions';

export const initialAuthState: AuthState = {
    user: new User(),
    githubError: false,
    googleError: false
};

export function authReducer(state = initialAuthState, action: authActions.UserActions): AuthState {
    switch (action.type) {
        case authActions.LOGIN_USER_SUCCESS:
            const oldState = Object.assign({}, state);
            oldState.user = (action.payload as User);
            return oldState;

        case authActions.GITHOB_LOGIN_ERROR:
            const oldState1 = Object.assign({}, state);
            oldState1.githubError = (action.payload as boolean);
            return oldState1;

        case authActions.GOOGLE_LOGIN_ERROR:
            const oldState2 = Object.assign({}, state);
            oldState2.googleError = (action.payload as boolean);
            return oldState2;

        case authActions.ADD_ORGANIZATION_TO_USER:
            const userState1 = Object.assign({}, state);
            userState1.user.organisationId = (action.payload as any).id;
            userState1.user.organisationName = (action.payload as any).name;
            userState1.user.isAdmin = true;
            return userState1;
        case authActions.UPDATE_USER_ORGANIZATION:
            const authState = Object.assign({}, state);
            authState.user.organisationName = (action.payload as string);
            authState.user.isAdmin = true;
            return authState;

        case authActions.DELETE_ORGANIZATION_FROM_USER:
            const userState = Object.assign({}, state);
            userState.user.organisationId = null;
            userState.user.organisationName = null;
            userState.user.isAdmin = null;
            return userState;
        default:
            return state;
    }
}
