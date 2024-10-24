import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as containerActions from './container.actions';
import * as globalActions from '../global.actions';
import { switchMap, map, catchError } from 'rxjs/operators';

// PROJECT SERVICE FOR HTTP CALLS
import { ContainerService } from '../../container/container.service';
import { Action } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ResourceService } from 'src/app/resource/resource.service';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';


export class EffectError implements Action {
  readonly type = '[Error] Effect Error';
}

@Injectable()
export class ContainerEffects {

  constructor(private toaster: ToastrService,
    private actions: Actions,
    private containerService: ContainerService,
    private resourceService: ResourceService,
    private translateService: AppTranslateService
  ) { }


  createNewContainer$ = createEffect(() => this.actions.pipe(
    ofType(containerActions.ADD_CONTAINER),
    switchMap((action: containerActions.AddContainer) => {
      return this.containerService.addNewContainer(action.payload).pipe(
        map(containerCreated => {
          this.toaster.success(this.translateService.getMessage('toaster.container.added'));
          return new containerActions.AddContainerSuccess(containerCreated);
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    }
    )
  ))


  updateContainer$ = createEffect(() => this.actions.pipe(
    ofType(containerActions.UPDATE_CONTAINER),
    switchMap((action: containerActions.UpdateContainer) => {
      return this.containerService.addNewContainer(action.payload).pipe(
        map((cont) => {
          if (action.msg) {
            this.toaster.success(this.translateService.getMessage(action.msg));
          }
          return new containerActions.UpdateContainerSuccess(cont);
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  ))


  getContainer$ = createEffect(() => this.actions.pipe(
    ofType(containerActions.GET_CONTAINER),
    switchMap((action: containerActions.GetContainer) => {
      return this.containerService.getContainerByID(action.payload).pipe(
        map((cont) => {
          this.toaster.success(action.msg);
          return new containerActions.UpdateContainerSuccess(cont);
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  ))


  deleteContainer$ = createEffect(() => this.actions.pipe(
    ofType(containerActions.DELETE_CONTAINER),
    switchMap((action: containerActions.DeleteContainer) => {
      return this.containerService.deleteContainerById(action.payload).pipe(
        map(() => {
          this.toaster.success(this.translateService.getMessage('toaster.container.deleted'));
          return new containerActions.DeleteContainerSucess(action.payload);
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  ))


  deleteContainerFiles$ = createEffect(() => this.actions.pipe(
    ofType(containerActions.DELETE_ACTIVE_CONTAINER_FILES),
    switchMap((action: containerActions.DeleteActiveContainerFiles) => {
      return this.resourceService.deleteFiles(action.payload).pipe(
        map(() => {
          this.toaster.success(this.translateService.getMessage('toaster.container.filesDeleted'));
          return new containerActions.DeleteActiveContainerFilesSuccess(action.payload);
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  ))


  deleteAllContainers$ = createEffect(() => this.actions.pipe(
    ofType(containerActions.DELETE_ALL_CONTAINERS),
    switchMap((action: containerActions.DeleteAllContainers) => {
      return this.containerService.deleteAllContainers(action.payload).pipe(
        map(() => {
          this.toaster.success(this.translateService.getMessage('toaster.container.allDeleted'));
          return new containerActions.DeleteAllContainersSuccess();
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  ))


  importSwagger$ = createEffect(() => this.actions.pipe(
    ofType(containerActions.IMPORT_SWAGGER_FILE),
    switchMap((action: containerActions.ImportSwaggerFile) => {
      return this.containerService.importSwaggerFile(action.payload, action.projectId, action.containerName).pipe(
        map((container) => {
          this.toaster.success(this.translateService.getMessage('toaster.container.added'));
          return new containerActions.AddContainerSuccess(container);
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  ))


  importContainer$ = createEffect(() => this.actions.pipe(
    ofType(containerActions.IMPORT_CONTAINER),
    switchMap((action: containerActions.ImportContainer) => {
      return this.containerService.importContainer(action.payload, action.projectId, action.containerName, action.dbsourceId, action.databaseName).pipe(
        map((container) => {
          if (container.id) {
            this.toaster.success(this.translateService.getMessage('toaster.container.added'));
            return new containerActions.AddContainerSuccess(container);
          } else {
            this.toaster.error(this.translateService.getMessage('toaster.container.fileLimit'));
          }

        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  ))




  enableDisable$ = createEffect(() => this.actions.pipe(
    ofType(containerActions.ENABLE_DISABLE_CONTAINER),
    switchMap((action: containerActions.EnableDisableContainer) => {
      return this.containerService.enableDisableContainer(action.payload).pipe(
        map(() => {
          this.toaster.success(this.translateService.getMessage('toaster.container.updated'));
          return new containerActions.EnableDisableSuccess(action.payload);
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  ))

}
