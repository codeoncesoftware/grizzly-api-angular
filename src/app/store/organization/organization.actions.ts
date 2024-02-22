import { Action } from '@ngrx/store';
import { Organization } from 'src/app/shared/models/Organization';


export const LOAD_ALL_ORGANIZATIONS_SUCCESS = '[Organization] LOAD_ALL_ORGANIZATIONS_SUCCESS';
export const LOAD_ALL_ORGANIZATIONS = '[Organization] LOAD_ALL_ORGANIZATIONS';
export const ADD_ORGANIZATION = '[Organization] ADD_ORGANIZATION';
export const ADD_ORGANIZATION_SUCCESS = '[Organization] ADD_ORGANIZATION_SUCCESS';
export const UPDATE_ORGANIZATION = '[Organization] UPDATE_ORGANIZATION';
export const UPDATE_ORGANIZATION_SUCCESS = '[Organization] UPDATE_ORGANIZATION_SUCCESS';
export const DEELTE_ORGANIZATION = '[Organization] DEELTE_ORGANIZATION';
export const DEELTE_ORGANIZATION_SUCCESS = '[Organization] DEELTE_ORGANIZATION_SUCCESS';


export class LoadAllOrganizations implements Action {
    readonly type: string = LOAD_ALL_ORGANIZATIONS;
    constructor(public payload: any = {}) { }
}

export class LoadAllOrganizationsSuccess implements Action {
    readonly type: string = LOAD_ALL_ORGANIZATIONS_SUCCESS;
    constructor(public payload: any[]) { }
}

export class AddOrganization implements Action {
    readonly type: string = ADD_ORGANIZATION;
    constructor(public payload: Organization) { }
}

export class AddOrganizationSuccess implements Action {
    readonly type: string = ADD_ORGANIZATION_SUCCESS;
    constructor(public payload: any) { }
}
export class UpdateOrganization implements Action {
    readonly type: string = UPDATE_ORGANIZATION;
    constructor(public payload: {organization: any, id: string }) { }
}

export class UpdateOrganizationSuccess implements Action {
    readonly type: string = UPDATE_ORGANIZATION_SUCCESS;
    constructor(public payload: any) { }
}
export class DeleteOrganization implements Action {
    readonly type: string = DEELTE_ORGANIZATION;
    constructor(public payload: string) { }
}

export class DeleteOrganizationSuccess implements Action {
    readonly type: string = DEELTE_ORGANIZATION_SUCCESS;
    constructor(public payload: string) { }
}

export type OrganizationActions =
    LoadAllOrganizations
    | LoadAllOrganizationsSuccess
    | AddOrganization
    | AddOrganizationSuccess
    | UpdateOrganization
    | UpdateOrganizationSuccess
    | DeleteOrganization
    | DeleteOrganizationSuccess;
