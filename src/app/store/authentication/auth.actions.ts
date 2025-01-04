import { Action, UPDATE } from '@ngrx/store';
import { User } from 'src/app/shared/models/User';

export const ADD_USER = '[User] ADD_USER';
export const LOGIN_USER = '[User] LOGIN_USER';
export const LOGIN_USER_SUCCESS = '[User] LOGIN_USER_SUCCESS';
export const GITHOB_LOGIN_ERROR = '[User] GITHOB_LOGIN_ERROR';
export const GOOGLE_LOGIN_ERROR = '[User] GOOGLE_LOGIN_ERROR';
export const DELETE_ORGANIZATION_FROM_USER = '[User] DELETE_ORGANIZATION_FROM_USER';
export const ADD_ORGANIZATION_TO_USER = '[User] ADD_ORGANIZATION_TO_USER';
export const UPDATE_USER_ORGANIZATION = '[User] UPDATE_USER_ORGANIZATION';

export class AddUser implements Action {
    readonly type: string = ADD_USER;
    constructor(public payload: User) {}
}

export class LoginUser implements Action {
    readonly type: string = LOGIN_USER;
    constructor(public payload: string) {}
}

export class LoginUserSuccess implements Action {
    readonly type: string = LOGIN_USER_SUCCESS;
    constructor(public payload: User) {}
}

export class LoginGithubError implements Action {
    readonly type: string = GITHOB_LOGIN_ERROR;
    constructor(public payload: boolean) {}
}

export class LoginGoogleError implements Action {
    readonly type: string = GOOGLE_LOGIN_ERROR;
    constructor(public payload: boolean) {}
}

export class AddOrganizationToUser implements Action {
    readonly type: string = ADD_ORGANIZATION_TO_USER;
    constructor(public payload: any) {}
}

export class UpdateUserOrganization implements Action {
    readonly type: string = UPDATE_USER_ORGANIZATION;
    constructor(public payload: string) {}
}

export class DeleteOrganizationFromUser implements Action {
    readonly type: string = DELETE_ORGANIZATION_FROM_USER;
    constructor(public payload: string) {}
}
export type UserActions = AddUser | LoginUser | LoginUserSuccess | LoginGithubError | DeleteOrganizationFromUser | LoginGoogleError;
