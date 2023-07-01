import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as dbsourceActions from './dbsource.actions';
import * as globalActions from '../global.actions';
import { switchMap, map, catchError } from 'rxjs/operators';

// DBSource SERVICE FOR HTTP CALLS
import { DBSourceService } from 'src/app/dbsource/dbsource.service';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DbsourceTableDetailsModalComponent } from 'src/app/dbsource/dbsource-details/dbsource-table-details-modal/dbsource-table-details-modal.component';

@Injectable()
export class DBSourceEffects {

  constructor(private router: Router,
              private actions: Actions,
              private dbsourceService: DBSourceService,
              private toaster: ToastrService,
              private translateService: AppTranslateService
              ) { }

  @Effect()
  loadDBSources = this.actions.pipe(
    ofType(dbsourceActions.LOAD_ALL_DBSOURCES),
    switchMap(() => {
      return this.dbsourceService.getAll().pipe(
        map(dbSources => new dbsourceActions.LoadAllDBSourcesSuccess(dbSources)),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  );

  @Effect()
  createNewDBSource = this.actions.pipe(
    ofType(dbsourceActions.ADD_DBSOURCE),
    switchMap((action: dbsourceActions.AddDBSource) => {
      return this.dbsourceService.updateDBSource(action.payload).pipe(
        map(dbsource => {
          this.toaster.success(this.translateService.getMessage('toaster.datasource.added'));
           this.router.navigateByUrl('/app/dbsource/' + dbsource.id);
          return new dbsourceActions.AddDBSourceSuccess(dbsource);
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    }
    )
  );

  @Effect()
  updateDBSource = this.actions.pipe(
    ofType(dbsourceActions.UPDATE_DBSOURCE),
    switchMap((action: dbsourceActions.UpdateDBSource) => {
      return this.dbsourceService.saveDBSource(action.payload).pipe(
        map(dbsource => {
          this.toaster.success(this.translateService.getMessage('toaster.datasource.updated'));
          return new dbsourceActions.UpdateDBSourceSuccess(dbsource);
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  );

  @Effect()
  deleteDBSource = this.actions.pipe(
    ofType(dbsourceActions.DELETE_DBSOURCE),
    map((action: dbsourceActions.DeleteDBSource) => {
      this.dbsourceService.deleteDBSource(action.payload).subscribe(() => {
        this.toaster.success(this.translateService.getMessage('toaster.datasource.deleted'));
      });
      return new dbsourceActions.DeleteDBSourceSuccess(action.payload);
    }),
    catchError(() => of(new globalActions.EffectError({})))
  );

  @Effect()
  addNewCollection = this.actions.pipe(
    ofType(dbsourceActions.ADD_NEW_COLLECTION),
    switchMap((action: dbsourceActions.AddNewCollection) => {
      return this.dbsourceService.saveNewCollection(action.payload.containerId, action.payload.collectionName).pipe(
        map((res) => {
          if (res === true) {
            this.toaster.success(this.translateService.getMessage('toaster.datasource.collection.added'));
            return new dbsourceActions.AddNewCollectionSuccess({ dbsourceId: action.payload.dbsourceId, databaseName: action.payload.databaseName, containerId: action.payload.containerId, collectionName: action.payload.collectionName });
          } else {
            this.toaster.error(this.translateService.getMessage('toaster.datasource.collection.error'));
          }
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  );
  @Effect()
  addNeTable = this.actions.pipe(
    ofType(dbsourceActions.ADD_TABLE),
    switchMap((action: dbsourceActions.AddNewTable) => {
      return this.dbsourceService.executeQuery(action.payload.customQuery, action.payload.dbsourceId).pipe(
        map((res) => {
          if (res === null) {
            this.toaster.success(this.translateService.getMessage('toaster.datasource.table.added'));
            return new dbsourceActions.AddNewTableSuccess({ dbsourceId: action.payload.dbsourceId, constrains : action.payload.constrains , indexes : action.payload.indexes , table : action.payload.table});
          }},
          (err) => {
            this.toaster.error(err.error)
          }),
          catchError((err) => {
            this.toaster.error(err.error);
            return of(new globalActions.EffectError({}));
          }));
    })
  );
  @Effect()
  dropCollection = this.actions.pipe(
    ofType(dbsourceActions.DROP_COLLECTION),
    switchMap((action: dbsourceActions.DropCollection) => {
      return this.dbsourceService.dropCollection(action.payload.dbsourceId, action.payload.databaseName, action.payload.collectionName).pipe(
        map(res => {
          this.toaster.success(action.payload.collectionName + ' ' + this.translateService.getMessage('toaster.datasource.collection.dropped'));
          return new dbsourceActions.DropCollectionSuccess({ dbsourceId: action.payload.dbsourceId, databaseName: action.payload.databaseName, containerId: null, collectionName: action.payload.collectionName });
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  );
  @Effect()
  dropTable = this.actions.pipe(
    ofType(dbsourceActions.DROP_TABLE),
    switchMap((action: dbsourceActions.DropTable) => {
      return this.dbsourceService.executeQuery(action.payload.customQuery, action.payload.dbsourceId).pipe(
        map(res => {
        this.toaster.success(this.translateService.getMessage('toaster.datasource.table.dropped'));
        return new dbsourceActions.DropTableSuccess({customQuery : action.payload.customQuery, dbsourceId: action.payload.dbsourceId , tableName : action.payload.tableName});
      },err=>{
        this.toaster.error(this.translateService.getMessage('toaster.datasource.table.error'));

        console.log(err.error);
      }))
    })
  );
}
