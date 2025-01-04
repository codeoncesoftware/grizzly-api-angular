import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as dbsourceActions from './dbsource.actions';
import * as globalActions from '../global.actions';
import { switchMap, map, catchError } from 'rxjs/operators';

// DBSource SERVICE FOR HTTP CALLS
import { DBSourceService } from 'src/app/dbsource/dbsource.service';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { IndexCollection } from 'src/app/shared/models/IndexCollection';

@Injectable()
export class DBSourceEffects {

  constructor(private router: Router,
    private actions: Actions,
    private dbsourceService: DBSourceService,
    private toaster: ToastrService,
    private translateService: AppTranslateService
  ) { }

  loadDBSources$ = createEffect(() => this.actions.pipe(
    ofType(dbsourceActions.LOAD_ALL_DBSOURCES),
    switchMap(() => {
      return this.dbsourceService.getAll().pipe(
        map(dbSources => new dbsourceActions.LoadAllDBSourcesSuccess(dbSources)),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  ))


  createNewDBSource$ = createEffect(() => this.actions.pipe(
    ofType(dbsourceActions.ADD_DBSOURCE,
      dbsourceActions.ADD_DBSOURCE_BQ),
    switchMap((action: dbsourceActions.AddDBSource | dbsourceActions.AddDBSourceBigQuery) => {
      if (action.type === dbsourceActions.ADD_DBSOURCE) {
        return this.dbsourceService.updateDBSource(action.payload).pipe(
          map(dbsource => {
            this.toaster.success(this.translateService.getMessage('toaster.datasource.added'));
            this.router.navigateByUrl('/app/dbsource/' + dbsource.id);
            return new dbsourceActions.AddDBSourceSuccess(dbsource);
          }),
          catchError(() => of(new globalActions.EffectError({})))
        );
      } else if (action.type === dbsourceActions.ADD_DBSOURCE_BQ) {
        // Traitez l'ajout avec BigQuery ici
        const bigQueryAction = action as dbsourceActions.AddDBSourceBigQuery;
        return this.dbsourceService.updateDBSourceBigQuery(bigQueryAction.payload, bigQueryAction.file).pipe(
          map(dbsource => {
            this.toaster.success(this.translateService.getMessage('toaster.datasource.added'));
            this.router.navigateByUrl('/app/dbsource/' + dbsource.id);
            return new dbsourceActions.AddDBSourceSuccess(dbsource);
          }),
          catchError(() => of(new globalActions.EffectError({})))
        );
      }
    }
    )
  ))

  createNewDBSourceAI$ = createEffect(() => this.actions.pipe(
    ofType(dbsourceActions.ADD_DBSOURCEAI,
      dbsourceActions.ADD_DBSOURCE_BQ),
    switchMap((action: dbsourceActions.AddDBSourceAI) => {
     
        return this.dbsourceService.updateDBSource(action.payload).pipe(
          map(dbsource => {
            this.toaster.success(this.translateService.getMessage('toaster.datasource.added'));
            this.router.navigateByUrl('/app/grizzly-ai');
            return new dbsourceActions.AddDBSourceSuccessAI(dbsource);
          }),
          catchError(() => of(new globalActions.EffectError({})))
        );
      
    }
    )
  ))

  updateDBSource$ = createEffect(() => this.actions.pipe(
    ofType(dbsourceActions.UPDATE_DBSOURCE, dbsourceActions.UPDATE_DBSOURCEBQ),
    switchMap((action: dbsourceActions.UpdateDBSource | dbsourceActions.UpdateDBSourceBigQuery) => {
      if (action.type === dbsourceActions.UPDATE_DBSOURCE) {
        return this.dbsourceService.saveDBSource(action.payload).pipe(
          map(dbsource => {
            this.toaster.success(this.translateService.getMessage('toaster.datasource.updated'));
            return new dbsourceActions.UpdateDBSourceSuccess(dbsource);
          }),
          catchError(() => of(new globalActions.EffectError({})))
        );
      }
      else if (action.type === dbsourceActions.UPDATE_DBSOURCEBQ) {
        const bigQueryAction = action as dbsourceActions.AddDBSourceBigQuery;
        return this.dbsourceService.saveDBSourceBigquery(bigQueryAction.payload, bigQueryAction.file).pipe(
          map(dbsource => {
            this.toaster.success(this.translateService.getMessage('toaster.datasource.updated'));
            return new dbsourceActions.UpdateDBSourceSuccess(dbsource);
          }),
          catchError(() => of(new globalActions.EffectError({})))
        );
      }
    })
  ))


  deleteDBSource$ = createEffect(() => this.actions.pipe(
    ofType(dbsourceActions.DELETE_DBSOURCE),
    map((action: dbsourceActions.DeleteDBSource) => {
      this.dbsourceService.deleteDBSource(action.payload).subscribe(() => {
        this.toaster.success(this.translateService.getMessage('toaster.datasource.deleted'));
      });
      return new dbsourceActions.DeleteDBSourceSuccess(action.payload);
    }),
    catchError(() => of(new globalActions.EffectError({})))
  ))


  addNewCollection$ = createEffect(() => this.actions.pipe(
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
  ))


  addNeTable$ = createEffect(() => this.actions.pipe(
    ofType(dbsourceActions.ADD_TABLE),
    switchMap((action: dbsourceActions.AddNewTable) => {
      return this.dbsourceService.executeQuery(action.payload.customQuery, action.payload.dbsourceId).pipe(
        map((res) => {
          if (res === null) {
            this.toaster.success(this.translateService.getMessage('toaster.datasource.table.added'));
            return new dbsourceActions.AddNewTableSuccess({ dbsourceId: action.payload.dbsourceId, constrains: action.payload.constrains, indexes: action.payload.indexes, table: action.payload.table });
          }
        },
          (err) => {
            this.toaster.error(err.error)
          }),
        catchError((err) => {
          this.toaster.error(err.error);
          return of(new globalActions.EffectError({}));
        }));
    })
  ))


  dropCollection$ = createEffect(() => this.actions.pipe(
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
  ))


  dropTable$ = createEffect(() => this.actions.pipe(
    ofType(dbsourceActions.DROP_TABLE),
    switchMap((action: dbsourceActions.DropTable) => {
      return this.dbsourceService.executeQuery(action.payload.customQuery, action.payload.dbsourceId).pipe(
        map(res => {
          this.toaster.success(this.translateService.getMessage('toaster.datasource.table.dropped'));
          return new dbsourceActions.DropTableSuccess({ customQuery: action.payload.customQuery, dbsourceId: action.payload.dbsourceId, tableName: action.payload.tableName });
        }, err => {
          this.toaster.error(this.translateService.getMessage('toaster.datasource.table.error'));

          console.log(err.error);
        }))
    })
  ))


  updateCollection$ = createEffect(() => this.actions.pipe(
    ofType(dbsourceActions.UPDATE_COLLECTION),
    switchMap((action: dbsourceActions.UpdateCollection) => {
      console.log(action.payload);
      console.log(action.payload.newCollectionName); 
      return this.dbsourceService.updateCollection(action.payload.dbsourceId, action.payload.databaseName, action.payload.collectionName, action.payload.newCollectionName).pipe(
        map(res => {
          this.toaster.success(this.translateService.getMessage('toaster.datasource.collection.updated'));
          return new dbsourceActions.UpdateCollectionSuccess({ dbsourceId: action.payload.dbsourceId, databaseName: action.payload.databaseName, containerId: null, collectionName: action.payload.collectionName,newCollectionName: action.payload.newCollectionName });
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  ))

  addNewCollectionIndex$ = createEffect(() => this.actions.pipe(
    ofType(dbsourceActions.ADD_NEW_COLLECTION_INDEX),
    switchMap((action: dbsourceActions.AddNewCollectionIndex) => {
       const addIndexAction = action as dbsourceActions.AddNewCollectionIndex;
           
      return this.dbsourceService.createCollectionIndex(action.payload.dbsourceId, action.payload.databaseName, action.payload.collectionName,addIndexAction.indexRequest).pipe(
        map(res => {
          this.toaster.success(this.translateService.getMessage('toaster.datasource.index.added'));
          return new dbsourceActions.AddNewCollectionIndexSuccess({ dbsourceId: action.payload.dbsourceId, databaseName: action.payload.databaseName, containerId: null, collectionName: action.payload.collectionName,newCollectionName: null });
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  ))

  dropCollectionIndex$ = createEffect(() => this.actions.pipe(
    ofType(dbsourceActions.DROP_COLLECTION_INDEX),
    switchMap((action: dbsourceActions.DropCollectionIndex) => {
      const dropIndexAction = action as dbsourceActions.DropCollectionIndex ;
      return this.dbsourceService.dropCollectionIndex(action.payload.dbsourceId, action.payload.databaseName, action.payload.collectionName, dropIndexAction.indexName).pipe(
        map(res => {
          this.toaster.success(this.translateService.getMessage('toaster.datasource.index.dropped'));
          return new dbsourceActions.DropCollectionIndexSuccess({ dbsourceId: action.payload.dbsourceId, databaseName: action.payload.databaseName, containerId: null, collectionName: action.payload.collectionName });
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  ))
 
        updateCollectionCustomQuery$ = createEffect(() => this.actions.pipe(
    ofType(dbsourceActions.UPDATE_COLLECTION_CUSTOMQUERY),
    switchMap((action: dbsourceActions.UpdateCollectionCustomQuery) => {
      return this.dbsourceService.updateCollectionNameCustomQuery(action.payload.dbsourceId, action.payload.databaseName, action.payload.collectionName, action.payload.newCollectionName).pipe(
        map(res => {
           return new dbsourceActions.UpdateCollectionNameCustomQuerySuccess({ dbsourceId: action.payload.dbsourceId, databaseName: action.payload.databaseName, containerId: null, collectionName: action.payload.collectionName,newCollectionName: action.payload.newCollectionName });
        }),
        catchError(() => of(new globalActions.EffectError({})))
      );
    })
  ))

  loadCollectionFields$ = createEffect(() => this.actions.pipe(
    ofType(dbsourceActions.LOAD_ALL_COLLECTIONS_FIELDS),
    switchMap((action: dbsourceActions.LoadCollectionFields) => {
      return this.dbsourceService.getCollectionFields(action.payload.dbsourceId, action.payload.databaseName, action.payload.collectionName).pipe(
        map(dbSources =>{
          return new dbsourceActions.LoadCollectionFieldsSuccess({ dbsourceId: action.payload.dbsourceId, databaseName: action.payload.databaseName, containerId: null, collectionName: action.payload.collectionName,newCollectionName: null });
      }),
      catchError(() => of(new globalActions.EffectError({})))
    );
    })
  ))
}
