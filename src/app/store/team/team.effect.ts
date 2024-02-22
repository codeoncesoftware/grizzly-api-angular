import { Injectable, Optional, Inject } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
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
        // tslint:disable: align
        private actions: Actions,
        private teamService: TeamService,
        private toaster: ToastrService,
        private translateService: AppTranslateService
        // tslint:enable: align
    ) { }


    @Effect()
    updateTeam = this.actions.pipe(
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
    );
}
