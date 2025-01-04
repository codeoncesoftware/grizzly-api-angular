import { Injectable } from '@angular/core';
import * as authActions from './auth.actions';
import * as globalActions from '../global.actions';
import { AuthService } from 'src/app/auth/auth.service';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { OrganizationService } from 'src/app/organization/organization-menu/organization.service';


@Injectable()
export class AuthEffects {

  constructor(private actions: Actions,
    private organisationService: OrganizationService) { }


  login$ = createEffect(() => this.actions.pipe(
    ofType(authActions.LOGIN_USER),
    switchMap((action: authActions.LoginUser) => {
      return this.organisationService.getCurrentUseAndOrganisation().pipe(
        map(user => {
          return new authActions.LoginUserSuccess(user);
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  ))

}
