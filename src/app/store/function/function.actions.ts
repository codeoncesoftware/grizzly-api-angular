import { Action } from '@ngrx/store';
import { Function } from 'src/app/shared/models/Function';

export const LOAD_ALL_FUNCTIONS_SUCCESS = '[Function] LOAD_ALL_FUNCTIONS_SUCCESS';
export const LOAD_ALL_FUNCTIONS = '[Function] LOAD_ALL_FUNCTIONS';
export const CREATE_FUNCTION = '[Function] CREATE_FUNCTION';
export const CREATE_FUNCTION_SUCCESS = '[Function] CREATE_FUNCTION_SUCCESS';
export const DELETE_FUNCTION = '[Function] REMOVE_FUNCTION';
export const UPDATE_FUNCTION = '[Function] UPDATE_FUNCTION';
export const UPDATE_FUNCTION_SUCCESS = '[Function] UPDATE_FUNCTION_SUCCESS';
export const DELETE_FUNCTION_SUCCESS = '[Function] REMOVE_FUNCTION_SUCCESS';
export const GET_FUNCTION = '[Function] GET_FUNCTION';
export const GET_FUNCTION_SUCCESS = '[Function] GET_FUNCTION_SUCCESS';
export const DELETE_ALL_FUNCTIONS = '[Function] REMOVE_ALL_FUNCTIONS';
export const DELETE_ALL_FUNCTIONS_SUCCESS = '[Function] REMOVE_ALL_FUNCTIONS_SUCCESS';
export const LOAD_ACTIVE_FUNCTION = '[Function] LOAD_ACTIVE_FUNCTION';
export const DELLETE_ACTIVE_FUNCTION = '[Function] DELETE_ACTIVE_CONTAINER';
export const CLONE_FUNCTION = '[Function] ADD_FUNCTION';
export const CLONE_FUNCTION_SUCCESS = '[Function] ADD_FUNCTION_SUCCESS';
export const SELECT_FUNCTION = '[Function] SELECT_FUNCTION';
export const UPDATE_FUNCTION_FAILED = '[Function] UPDATE_FUNCTION_FAILED';


export class CreateFunction implements Action {
    readonly type: string = CREATE_FUNCTION;
    constructor(public payload: any) { }
}

export class CreateFunctionSuccess implements Action {
    readonly type: string = CREATE_FUNCTION_SUCCESS;
    constructor(public payload: any) { }
}

export class GetAllFunctions implements Action {
    readonly type: string = LOAD_ALL_FUNCTIONS;
    constructor(public payload: string) { }
}

export class DeleteActiveFunction implements Action {
    readonly type: string = DELLETE_ACTIVE_FUNCTION;
    constructor(public payload: string) { }
}

export class LoadActiveFunction implements Action {
    readonly type: string = LOAD_ACTIVE_FUNCTION;
    constructor(public payload: any) { }
}

export class GetAllFunctionsSuccess implements Action {
    readonly type: string = LOAD_ALL_FUNCTIONS_SUCCESS;
    constructor(public payload: Array<any>) { }
}

export class GetFunction implements Action {
    readonly type: string = GET_FUNCTION;
    constructor(public payload: string) { }
}

export class GetFunctionSuccess implements Action {
    readonly type: string = GET_FUNCTION_SUCCESS;
    constructor(public payload: any) { }
}


export class DeleteFunction implements Action {
    readonly type: string = DELETE_FUNCTION;
    constructor(public payload: { projectId: string, name: string, version: string }) { }
}

export class DeleteFunctionSuccess implements Action {
    readonly type: string = DELETE_FUNCTION_SUCCESS;
    constructor(public payload: { projectId: string, name: string, version: string }) { }
}

export class DeleteALLFunctions implements Action {
    readonly type: string = DELETE_ALL_FUNCTIONS;
    constructor(public payload: any[]) { }
}


export class UpdateFunctionFailed implements Action {
    readonly type: string = UPDATE_FUNCTION_FAILED;
    constructor(public payload: any[]) { }
}

export class DeleteAllFunctionsSuccess implements Action {
    readonly type: string = DELETE_ALL_FUNCTIONS_SUCCESS;
    constructor(public payload: any[]) { }
}

export class UpdateFunction implements Action {
    readonly type: string = UPDATE_FUNCTION;
    constructor(public projectId: string, public name: string, public version: string, public payload: any) { }
}

export class UpdateFunctionSuccess implements Action {
    readonly type: string = UPDATE_FUNCTION_SUCCESS;
    constructor(public payload:{ functionCreated:any,oldName:string , oldVersion:string}) { }
}


export class CloneFunction implements Action {
    readonly type: string = CLONE_FUNCTION;
    constructor(public payload: string, public version: string, public name: string, public projectId: string) { }
}

export class CloneFunctionSuccess implements Action {
    readonly type: string = CLONE_FUNCTION_SUCCESS;
    constructor(public payload: any) { }
}

export class SelectFunction implements Action {
    readonly type: string = SELECT_FUNCTION;
    constructor(public payload: any) { }
}

export type FunctionActions = GetFunction | GetFunctionSuccess | GetAllFunctions | GetAllFunctionsSuccess | UpdateFunction | UpdateFunctionSuccess | DeleteFunction | DeleteFunctionSuccess | DeleteALLFunctions | DeleteAllFunctionsSuccess | CreateFunction | CreateFunctionSuccess | CloneFunction | CloneFunctionSuccess;
