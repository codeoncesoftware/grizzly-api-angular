import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as functionActions from 'src/app/store/function/function.actions';
import { ToastrService } from 'ngx-toastr';
import { FunctionService } from 'src/app/function/function.service';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as globalActions from '../global.actions';

export class EffectError implements Action {
  readonly type = '[Error] Effect Error';
}

@Injectable()
export class FunctionEffects {

  constructor(private toaster: ToastrService, private actions: Actions, private functionService: FunctionService, private translateService: AppTranslateService
  ) { }


  createFunction$ = createEffect(() => this.actions.pipe(
    ofType(functionActions.CREATE_FUNCTION),
    switchMap((action: functionActions.CreateFunction) => {
      return this.functionService.createFunction(action.payload).pipe(
        map(functionCreated => {
          this.toaster.success(this.translateService.getMessage('toaster.function.added'));
          return new functionActions.CreateFunctionSuccess(functionCreated);
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    }
    )
  ))



  updateFunction$ = createEffect(() => this.actions.pipe(
    ofType(functionActions.UPDATE_FUNCTION),
    switchMap((action: functionActions.UpdateFunction) => {
      return this.functionService.updateFunction(action.projectId, action.name, action.version, action.payload).pipe(
        map(functionCre => {
          this.toaster.success(this.translateService.getMessage('toaster.function.updated'));
          const v = { functionCreated: functionCre, oldName: action.name, oldVersion: action.version };
          return new functionActions.UpdateFunctionSuccess(v);
        }),
        catchError(() => {
          this.toaster.error(this.translateService.getMessage('toaster.function.notUnique'));
          return of(new globalActions.EffectError({}));
        })
      );
    }
    )
  ))


  getAllFunctions = createEffect(() => this.actions.pipe(
    ofType(functionActions.LOAD_ALL_FUNCTIONS),
    switchMap((action: functionActions.GetAllFunctions) => {

      return this.functionService.getFunctionsByProject(action.payload).pipe(
        map(functionsCreated => {
          return new functionActions.GetAllFunctionsSuccess(functionsCreated);
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    }
    )
  ))


  cloneFunction$ = createEffect(() => this.actions.pipe(
    ofType(functionActions.CLONE_FUNCTION),
    switchMap((action: functionActions.CloneFunction) => {
      return this.functionService.cloneFunction(action.projectId, action.name, action.version, action.payload).pipe(
        map(functionCloned => {
          this.toaster.success(this.translateService.getMessage('toaster.function.added'));
          return new functionActions.CloneFunctionSuccess(functionCloned);
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    }
    )
  ))


  deleteFunction$ = createEffect(() => this.actions.pipe(
    ofType(functionActions.DELETE_FUNCTION),
    switchMap((action: functionActions.DeleteFunction) => {

      return this.functionService.deleteFunction(action.payload.projectId, action.payload.name, action.payload.version).pipe(
        map(() => {
          this.toaster.success(this.translateService.getMessage('toaster.function.deleted'));
          return new functionActions.DeleteFunctionSuccess({ projectId: action.payload.projectId, name: action.payload.name, version: action.payload.version });
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    }
    )))
}
