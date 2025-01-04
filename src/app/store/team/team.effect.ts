import { Injectable, Optional, Inject } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as teamActions from './team.actions';
import * as globalActions from '../global.actions';
import { switchMap, map, catchError } from 'rxjs/operators';

// PROJECT SERVICE FOR HTTP CALLS
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { TeamService } from 'src/app/organization/organization-teams/team.service';

@Injectable()

export class TeamEffects {
    constructor(private router: Router,
        /* eslint-disable @typescript-eslint/indent */
        private actions: Actions,
        private teamService: TeamService,
        private toaster: ToastrService,
        private translateService: AppTranslateService
        /* eslint-enable @typescript-eslint/indent */
    ) { }



    updateTeam$ = createEffect(() => this.actions.pipe(
        ofType(teamActions.UPDATE_TEAM),
        switchMap((action: teamActions.UpdateTeam) => {
            return this.teamService.updateTeam(action.payload.team, action.payload.id).pipe(
                map(
                    (result: any) => {
                        this.toaster.success(this.translateService.getMessage('toaster.team.updated'));
                        return new teamActions.UpdateTeamSuccess(result);
                    }));
        }),
        catchError(() => of(new globalActions.EffectError({})))
    ))
}
