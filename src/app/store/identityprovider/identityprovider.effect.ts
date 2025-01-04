import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as globalActions from '../global.actions';
import { switchMap, map, catchError } from 'rxjs/operators';
import * as identityproviderActions from './identityprovider.actions';

import { IdentityProviderService } from 'src/app/identity-provider/identityprovider.service';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DbsourceTableDetailsModalComponent } from 'src/app/dbsource/dbsource-details/dbsource-table-details-modal/dbsource-table-details-modal.component';

@Injectable()
export class IdentityProviderEffects {

  constructor(private router: Router,
    private actions: Actions,
    private identityProviderService: IdentityProviderService,
    private toaster: ToastrService,
    private translateService: AppTranslateService
  ) { }


  loadIdentityProviders$ = createEffect(() => this.actions.pipe(
    ofType(identityproviderActions.LOAD_ALL_IDENTITYPROVIDER),
    switchMap(() => {
      return this.identityProviderService.getAll().pipe(
        map(identityproviders => new identityproviderActions.LoadAllIdentityProviderSuccess(identityproviders)),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  ))



  createNewIdentityProvider$ = createEffect(() => this.actions.pipe(
    ofType(identityproviderActions.ADD_IDENTITYPROVIDER),
    switchMap((action: identityproviderActions.AddIdentityProvider) => {
      return this.identityProviderService.saveIdentityProvider(action.payload).pipe(
        map(identityprovider => {
          this.toaster.success(this.translateService.getMessage('toaster.identityprovider.added'));
          this.router.navigateByUrl('/app/identityprovider/' + identityprovider.id);
          return new identityproviderActions.AddIdentityProviderSuccess(identityprovider);
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    }
    )
  ))


  updateIdentityProvider$ = createEffect(() => this.actions.pipe(
    ofType(identityproviderActions.UPDATE_IDENTITYPROVIDER),
    switchMap((action: identityproviderActions.UpdateIdentityProvider) => {
      return this.identityProviderService.saveIdentityProvider(action.payload).pipe(
        map(identityprovider => {
          this.toaster.success(this.translateService.getMessage('toaster.identityprovider.updated'));
          this.router.navigateByUrl('/app/identityprovider/' + identityprovider.id);
          return new identityproviderActions.UpdateIdentityProviderSuccess(identityprovider);
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  ))

  deleteIdentityProvider$ = createEffect(() => this.actions.pipe(
    ofType(identityproviderActions.DELETE_IDENTITYPROVIDER),
    map((action: identityproviderActions.DeleteIdentityProvider) => {
      this.identityProviderService.deleteIdentityProvider(action.payload).subscribe(() => {
        this.toaster.success(this.translateService.getMessage('toaster.identityprovider.deleted'));
      });
      return new identityproviderActions.DeleteIdentityProviderSuccess(action.payload);
    }),
    catchError(() => of(new globalActions.EffectError({})))
  ))

}
