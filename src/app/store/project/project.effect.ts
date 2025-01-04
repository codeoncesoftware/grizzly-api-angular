import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as projectActions from './project.actions';
import * as globalActions from '../global.actions';
import { switchMap, map, catchError } from 'rxjs/operators';

// PROJECT SERVICE FOR HTTP CALLS
import { ProjectService } from '../../project/project.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';

export class EffectError implements Action {
  readonly type = '[Error] Effect Error';
}

@Injectable()
export class ProjectEffects {

  constructor(private router: Router,
    /* eslint-disable @typescript-eslint/indent */
    private actions: Actions,
    private projectService: ProjectService,
    private toaster: ToastrService,
    private translateService: AppTranslateService
  ) { }


  loadProjects$ = createEffect(() => this.actions.pipe(
    ofType(projectActions.LOAD_ALL_PROJECTS),
    switchMap(() => {
      return this.projectService.getAllProjects().pipe(
        map(projects => new projectActions.LoadAllProjectsSuccess(projects)),
        catchError(() => of(new globalActions.EffectError({})))
      );
    }),
  ))



  createNewProject = createEffect(() => this.actions.pipe(
    ofType(projectActions.ADD_PROJECT),
    switchMap((action: projectActions.AddProject) => {
      return this.projectService.createProject(action.payload).pipe(
        map(proj => {
          if (proj.id) {
            this.toaster.success(this.translateService.getMessage('toaster.project.added'));
            this.router.navigateByUrl('/app/project/' + proj.id);
            return new projectActions.AddProjectSuccess(proj);
          }

        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    }
    )))

    createNewProjectAI = createEffect(() => this.actions.pipe(
      ofType(projectActions.ADD_PROJECTAI),
      switchMap((action: projectActions.AddProjectAI) => {
        return this.projectService.createProject(action.payload).pipe(
          map(proj => {
            if (proj.id) {
              this.toaster.success(this.translateService.getMessage('toaster.project.added'));
              this.router.navigateByUrl('/app/grizzly-ai');
              return new projectActions.AddProjectSuccessAI(proj);
            }
  
          }),
          catchError(() => of(new globalActions.EffectError({})))
        );
      }
      )))

  deleteProject$ = createEffect(() => this.actions.pipe(
    ofType(projectActions.DELETE_PROJECT),
    map((action: projectActions.DeleteProject) => {
      this.projectService.deleteProjectById(action.payload).subscribe(() => {
        this.toaster.success(this.translateService.getMessage('toaster.project.deleted'));
      });
      return new projectActions.DeleteProjectSucess(action.payload);
    }),
    catchError(() => of(new globalActions.EffectError({})))
  ))




  updateProject = createEffect(() => this.actions.pipe(
    ofType(projectActions.UPDATE_PROJECT),
    map((action: projectActions.UpdateProject) => {
      this.projectService.updateProject(action.payload).subscribe((a) => {
        action.payload.lastUpdate = new Date().toUTCString();
        this.toaster.success(this.translateService.getMessage(action.msg));
        if (!this.router.url.includes('/editor')) {
          this.router.navigate(['/app/dashboard']).then(r => {
            this.router.navigateByUrl('/app/project/' + action.payload.id);
          });
        }
      })
      return new projectActions.UpdateProjectSuccess(action.payload);

    }),
    catchError(() => of(new globalActions.EffectError({})))
  ))

}
