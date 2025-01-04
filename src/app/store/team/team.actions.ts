import { Action } from '@ngrx/store';
export const UPDATE_TEAM = '[Team] UPDATE_TEAM';
export const UPDATE_TEAM_SUCCESS = '[Team] UPDATE_TEAM_SUCCESS';
export class UpdateTeam implements Action {
    readonly type: string = UPDATE_TEAM;
    constructor(public payload: { team: any, id: string }) { }
}
export class UpdateTeamSuccess {
    readonly type: string = UPDATE_TEAM_SUCCESS;
    constructor(public payload: any) { }
}
export type TeamActions =
    UpdateTeam
    | UpdateTeamSuccess;

