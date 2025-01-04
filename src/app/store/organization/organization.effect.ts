import { Injectable, Optional, Inject } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as organizationActions from './organization.actions';
import * as projectsActions from '../project/project.actions';
import * as globalActions from '../global.actions';
import { switchMap, map, catchError } from 'rxjs/operators';

// PROJECT SERVICE FOR HTTP CALLS
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { OrganizationService } from 'src/app/organization/organization-menu/organization.service';
import { OrganizationModalService } from 'src/app/organization/organisation-modal/organization-modal.service';

import { ProjectsState } from '../project/project.state';
import { ProjectService } from 'src/app/project/project.service';
import * as Auth from '../authentication/auth.actions';
import { AuthState } from '../authentication/auth.state';

export class EffectError implements Action {
    readonly type = '[Error] Effect Error';
}

@Injectable()
export class OrganizationEffects {

    constructor(private router: Router,
        /* eslint-disable @typescript-eslint/indent */
        private actions: Actions,
        private organizationService: OrganizationService,
        private toaster: ToastrService,
        private translateService: AppTranslateService,
        public organizationModal: OrganizationModalService,
        public projectsStore: Store<ProjectsState>,
        public projectService: ProjectService,
        public authStore: Store<AuthState>
        /* eslint-enable @typescript-eslint/indent */
    ) { }


    loadOrganization$ = createEffect(() => this.actions.pipe(
        ofType(organizationActions.LOAD_ALL_ORGANIZATIONS),
        switchMap(() => {
            return this.organizationService.getOrganisation().pipe(
                map((organization) => new organizationActions.LoadAllOrganizationsSuccess(organization)),
                catchError(() => of(new globalActions.EffectError({})))
            );
        }),
    ))


    createNewOrganization$ = createEffect(() => this.actions.pipe(
        ofType(organizationActions.ADD_ORGANIZATION),
        switchMap((action: organizationActions.AddOrganization) => {
            return this.organizationService.addOrganisation(action.payload).pipe(

                map((result: any) => {
                    this.toaster.success(this.translateService.getMessage('toaster.organization.added'));
                    this.organizationModal.close();
                    const accessor = 'projects';
                    this.router.navigate(['/app/organization/', result.id, 'details']);
                    this.projectsStore.select('projects').subscribe(state => {
                        const projects = state[accessor];
                        projects.forEach(element => {
                            element.organizationId = result.id;
                            element.teamIds = [];
                            this.projectService.updateProject(element).subscribe();
                        });
                    });
                    this.authStore.dispatch(new Auth.AddOrganizationToUser(result));
                    return new organizationActions.AddOrganizationSuccess(result);
                }),
                catchError(() => of(new globalActions.EffectError({})))
            );
        }
        )))


    updateOrganization$ = createEffect(() => this.actions.pipe(
        ofType(organizationActions.UPDATE_ORGANIZATION),
        switchMap((action: organizationActions.UpdateOrganization) => {
            return this.organizationService.updateOrganization(action.payload.organization, action.payload.id).pipe(
                map(
                    (result: any) => {
                        action.payload.organization.lastUpdate = new Date().toUTCString();
                        this.toaster.success(this.translateService.getMessage('toaster.organization.updated'));
                        this.authStore.dispatch(new Auth.UpdateUserOrganization(action.payload.organization.name));
                        return new organizationActions.UpdateOrganizationSuccess(result);
                    }));
        }),
        catchError(() => of(new globalActions.EffectError({})))
    ))


    deleteOrganization$ = createEffect(() => this.actions.pipe(
        ofType(organizationActions.DEELTE_ORGANIZATION),
        map((action: organizationActions.DeleteOrganization) => {
            this.organizationService.deleteOrganisation(action.payload).subscribe((data) => {
                if (!data) {
                    this.authStore.dispatch(new Auth.DeleteOrganizationFromUser(''));
                    this.router.navigate(['/app/dashboard']);
                    this.toaster.success(this.translateService.getMessage('toaster.organization.deleted'));
                } else {
                    this.router.navigate(['/app/organization/', action.payload, '/details']);
                }
            });
            const accessor = 'projects';
            this.projectsStore.select('projects').subscribe(state => {
                const projects = state[accessor];
                projects.forEach(element => {
                    element.organizationId = null;
                    element.teamIds = [];
                    this.projectService.updateProject(element).subscribe();
                });
            });
            return new organizationActions.DeleteOrganizationSuccess(action.payload);
        }),
        catchError(() => of(new globalActions.EffectError({})))
    ))

}
