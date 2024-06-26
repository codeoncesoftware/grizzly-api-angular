import { Action } from '@ngrx/store';
import { DBSource } from 'src/app/shared/models/DBSource';
import { Collection } from './dbsource';

export const ADD_DBSOURCE = '[DBSource] ADD_DBSOURCE';
export const ADD_DBSOURCE_SUCCESS = '[DBSource] ADD_DBSOURCE_SUCCESS';
export const ADD_DBSOURCE_BQ = '[DBSource] ADD_DBSOURCE_BQ';
export const ADD_DBSOURCE_BQ_SUCCESS = '[DBSource] ADD_DBSOURCE_BQ_SUCCESS';
export const UPDATE_DBSOURCEBQ = '[DBSource] UPDATE_DBSOURCEBQ';
export const UPDATE_DBSOURCEBQ_SUCCESS = '[DBSource] UPDATE_DBSOURCEBQ_SUCCESS';
export const DELETE_DBSOURCE = '[DBSource] DELETE_DBSOURCE';
export const DELETE_DBSOURCE_SUCCESS = '[DBSource] DELETE_DBSOURCE_SUCCESS';
export const LOAD_ALL_DBSOURCES = '[DBSource] LOAD_ALL_DBSOURCES';
export const LOAD_ALL_DBSOURCES_SUCCESS = '[DBSource] LOAD_ALL_DBSOURCES_SUCCESS';
export const UPDATE_DBSOURCE = '[DBSource] UPDATE_DBSOURCE';
export const UPDATE_DBSOURCE_SUCCESS = '[DBSource] UPDATE_DBSOURCE_SUCCESS';
export const LOAD_ACTIVE_DBSOURCE = '[DBSource] LOAD_ACTIVE_DBSOURCE';
export const ADD_NEW_COLLECTION = '[DBSource] ADD_NEW_COLLECTION';
export const ADD_NEW_COLLECTION_SUCCESS = '[DBSource] ADD_NEW_COLLECTION_SUCCESS';
export const DROP_COLLECTION = '[DBSource] DROP_COLLECTION';
export const DROP_COLLECTION_SUCCESS = '[DBSource] DROP_COLLECTION_SUCCESS';
export const ADD_TABLE = '[DBSource] ADD_TABLE';
export const ADD_TABLE_SUCCESS = '[DBSource] ADD_TABLE_SUCCESS';
export const DROP_TABLE = '[DBSource] DROP_TABLE';
export const DROP_TABLE_SUCCESS = '[DBSource] DROP_TABLE_SUCCESS';
/** Add a new Datasource */
export class AddDBSource implements Action {
    readonly type: string = ADD_DBSOURCE;
    constructor(public payload: DBSource) { }
}
export class AddDBSourceSuccess implements Action {
    readonly type: string = ADD_DBSOURCE_SUCCESS;
    constructor(public payload: DBSource) { }
}
/** Add a new Datasource BigQuery */
export class AddDBSourceBigQuery implements Action {
    readonly type: string = ADD_DBSOURCE_BQ;
    constructor(public payload: DBSource,public file: File) { }
}
export class AddDBSourceBigQuerySuccess implements Action {
    readonly type: string = ADD_DBSOURCE_BQ_SUCCESS;
    constructor(public payload: DBSource,public file: File) { }
}

/** Delete a specific Datasource */
export class DeleteDBSource implements Action {
    readonly type: string = DELETE_DBSOURCE;
    constructor(public payload: string) { }
}
export class DeleteDBSourceSuccess implements Action {
    readonly type: string = DELETE_DBSOURCE_SUCCESS;
    constructor(public payload: string) { }
}

/** Update a Specific Datasource */
export class UpdateDBSource implements Action {
    readonly type: string = UPDATE_DBSOURCE;
    constructor(public payload: DBSource) { }
}
export class UpdateDBSourceSuccess implements Action {
    readonly type: string = UPDATE_DBSOURCE_SUCCESS;
    constructor(public payload: DBSource) { }
}
/** Update a Specific Datasource bigquery */
export class UpdateDBSourceBigQuery implements Action {
    readonly type: string = UPDATE_DBSOURCEBQ;
    constructor(public payload: DBSource,public file: File) { }
}
export class UpdateDBSourceBigQuerySuccess implements Action {
    readonly type: string = UPDATE_DBSOURCEBQ_SUCCESS;
    constructor(public payload: DBSource,public file: File) { }
}
/** Load all Datasources */
export class LoadAllDBSources implements Action {
    readonly type: string = LOAD_ALL_DBSOURCES;
    constructor(public payload: any = {}) { }
}
export class LoadAllDBSourcesSuccess implements Action {
    readonly type: string = LOAD_ALL_DBSOURCES_SUCCESS;
    constructor(public payload: DBSource[]) { }
}

/** Load Active DBSource */
export class LoadActiveDbsource implements Action {
    readonly type: string = LOAD_ACTIVE_DBSOURCE;
    constructor(public payload: DBSource) {}
}

/** Add New Collection To Database */
export class AddNewCollection implements Action {
    readonly type: string = ADD_NEW_COLLECTION;
    constructor(public payload: Collection) {}
}
export class AddNewCollectionSuccess implements Action {
    readonly type: string = ADD_NEW_COLLECTION_SUCCESS;
    constructor(public payload: Collection) {}
}

/** Drop Collection from Free Database */
export class DropCollection implements Action {
    readonly type: string = DROP_COLLECTION;
    constructor(public payload: Collection) {}
}
export class DropCollectionSuccess implements Action {
    readonly type: string = DROP_COLLECTION_SUCCESS;
    constructor(public payload: Collection) {}
}
/** Add Table */
export class AddNewTable implements Action {
    readonly type: string = ADD_TABLE;
    constructor(public payload: any) {}
}
export class AddNewTableSuccess implements Action {
    readonly type: string = ADD_TABLE_SUCCESS;
    constructor(public payload: any) {}
}

/** Drop Table */
export class DropTable implements Action {
    readonly type: string = DROP_TABLE;
    constructor(public payload: any) {}
}
export class DropTableSuccess implements Action {
    readonly type: string = DROP_TABLE_SUCCESS;
    constructor(public payload: any) {}
}


export type DBSourceActions =
    AddDBSource |
    AddDBSourceSuccess |
    DeleteDBSource |
    DeleteDBSourceSuccess |
    LoadAllDBSources |
    LoadAllDBSourcesSuccess |
    LoadActiveDbsource |
    AddNewCollection |
    AddNewCollectionSuccess |
    AddNewTable |
    AddNewTableSuccess |
    DropCollection |
    DropCollectionSuccess |
    DropTable |
    DropTableSuccess;
