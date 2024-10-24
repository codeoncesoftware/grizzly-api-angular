import { Action } from '@ngrx/store';
import { IdentityProvider } from 'src/app/shared/models/IdentityProvider';

export const ADD_IDENTITYPROVIDER = '[IdentityProvider] ADD_IDENTITYPROVIDER';
export const ADD_IDENTITYPROVIDER_SUCCESS = '[IdentityProvider] ADD_IDENTITYPROVIDER_SUCCESS';
export const DELETE_IDENTITYPROVIDER = '[IdentityProvider] DELETE_IDENTITYPROVIDER';
export const DELETE_IDENTITYPROVIDER_SUCCESS = '[IdentityProvider] DELETE_IDENTITYPROVIDER_SUCCESS';
export const LOAD_ALL_IDENTITYPROVIDER = '[IdentityProvider] LOAD_ALL_IDENTITYPROVIDER';
export const LOAD_ALL_IDENTITYPROVIDER_SUCCESS = '[IdentityProvider] LOAD_ALL_IDENTITYPROVIDER_SUCCESS';
export const LOAD_ACTIVE_IDENTITYPROVIDER = '[IdentityProvider] LOAD_ACTIVE_IDENTITYPROVIDER';
export const UPDATE_IDENTITYPROVIDER = '[IdentityProvider] UPDATE_IDENTITYPROVIDER';
export const UPDATE_IDENTITYPROVIDER_SUCCESS = '[IdentityProvider] UPDATE_IDENTITYPROVIDER_SUCCESS';

export class AddIdentityProvider implements Action {
    readonly type: string = ADD_IDENTITYPROVIDER;
    constructor(public payload: IdentityProvider) { }
}
export class AddIdentityProviderSuccess implements Action {
    readonly type: string = ADD_IDENTITYPROVIDER_SUCCESS;
    constructor(public payload: IdentityProvider) { }
}

export class DeleteIdentityProvider implements Action {
    readonly type: string = DELETE_IDENTITYPROVIDER;
    constructor(public payload: string) { }
}
export class DeleteIdentityProviderSuccess implements Action {
    readonly type: string = DELETE_IDENTITYPROVIDER_SUCCESS;
    constructor(public payload: string) { }
}

export class UpdateIdentityProvider implements Action {
    readonly type: string = UPDATE_IDENTITYPROVIDER;
    constructor(public payload: IdentityProvider) { }
}
export class UpdateIdentityProviderSuccess implements Action {
    readonly type: string = UPDATE_IDENTITYPROVIDER_SUCCESS;
    constructor(public payload: IdentityProvider) { }
}

export class LoadAllIdentityProvider implements Action {
    readonly type: string = LOAD_ALL_IDENTITYPROVIDER;
    constructor(public payload: any = {}) { }
}
export class LoadAllIdentityProviderSuccess implements Action {
    readonly type: string = LOAD_ALL_IDENTITYPROVIDER_SUCCESS;
    constructor(public payload: IdentityProvider[]) { }
}
export class LoadActiveIdentityProvider implements Action {
    readonly type: string = LOAD_ACTIVE_IDENTITYPROVIDER;
    constructor(public payload: IdentityProvider) {}
}

export type IdentityProviderActions =
    AddIdentityProvider |
    AddIdentityProviderSuccess |
    DeleteIdentityProvider |
    DeleteIdentityProviderSuccess |
    UpdateIdentityProviderSuccess |
    UpdateIdentityProvider |
    LoadAllIdentityProvider |
    LoadAllIdentityProviderSuccess;
