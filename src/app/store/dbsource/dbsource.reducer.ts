import * as dbsource from './dbsource.actions';
import * as globalActions from '../global.actions';
import { DBSourcesState } from './dbsource.state';
import { DBSource } from 'src/app/shared/models/DBSource';
import { Collection } from './dbsource';
import { Table } from 'src/app/shared/models/Table';

export const initialDBSourcesState: DBSourcesState = {
    dbsources: [],
    active: new DBSource(),
    loading: false,
    limitReached: false
};

export function dbsourceReducer(state = initialDBSourcesState, action: dbsource.DBSourceActions): DBSourcesState {
    switch (action.type) {

        case dbsource.ADD_DBSOURCE_SUCCESS:
            const newState = Object.assign({}, state);
            newState.dbsources.push(action.payload as DBSource);
            newState.active = (action.payload as DBSource);
            return newState;
        case dbsource.ADD_DBSOURCE_SUCCESS_AI:
                const newStateAI = Object.assign({}, state);
                newStateAI.dbsources.push(action.payload as DBSource);
                newStateAI.active = (action.payload as DBSource);
                return newStateAI;

        case dbsource.LOAD_ALL_DBSOURCES_SUCCESS:
            const newAllDBSourcesState = Object.assign({}, state);
            newAllDBSourcesState.dbsources = (action.payload as DBSource[]);
            newAllDBSourcesState.loading = false;
            return newAllDBSourcesState;

        case dbsource.UPDATE_DBSOURCE_SUCCESS:
            const newUpdatedState = Object.assign({}, state);
            const updatedDbsource = (action.payload as DBSource);
            if (!updatedDbsource.active) {
                updatedDbsource.collectionsList = [];
            }
            const indexDBSourceToUpdate = newUpdatedState.dbsources.findIndex(db => db.id === (action.payload as DBSource).id);
            newUpdatedState.dbsources[indexDBSourceToUpdate] = updatedDbsource;
            newUpdatedState.active = updatedDbsource;
            return newUpdatedState;

        case dbsource.LOAD_ACTIVE_DBSOURCE:
            const stateNoActive = Object.assign({}, state);
            stateNoActive.active = (action.payload as DBSource);
            return stateNoActive;

        case dbsource.LOAD_ALL_DBSOURCES:
            const stateBeforeLoad = Object.assign({}, state);
            stateBeforeLoad.loading = true;
            return stateBeforeLoad;

        case dbsource.DELETE_DBSOURCE_SUCCESS:
            const stateAfterDelete = Object.assign({}, state);
            stateAfterDelete.dbsources = stateAfterDelete.dbsources.filter((db) => db.id !== action.payload);
            stateAfterDelete.limitReached = false;
            if (stateAfterDelete.dbsources.length > 0) {
                stateAfterDelete.active = stateAfterDelete.dbsources[stateAfterDelete.dbsources.length - 1];
            } else {
                stateAfterDelete.active = null;
            }
            return stateAfterDelete;

        case dbsource.ADD_NEW_COLLECTION_SUCCESS:
            const stateBeforeLoadField = Object.assign({}, state);
            stateBeforeLoadField.loading = true;
            return stateBeforeLoadField;
   
        case dbsource.Load_COLLECTION_FIELDS_SUCCESS:
            const stateAfterCollectionAdd = Object.assign({}, state);
            const dbsourceeIndex = stateAfterCollectionAdd.dbsources.findIndex(dbs => dbs.id === (action.payload as Collection).dbsourceId);
            const dbsourcee = stateAfterCollectionAdd.dbsources[dbsourceeIndex];
            if (dbsourcee) {
                const dbIndex = dbsourcee.databases.findIndex(database => database.name === (action as dbsource.AddNewCollectionSuccess).payload.databaseName);
                stateAfterCollectionAdd.dbsources[dbsourceeIndex].databases[dbIndex].collections.push((action as dbsource.AddNewCollectionSuccess).payload.collectionName);
            }
            return stateAfterCollectionAdd;
        case dbsource.ADD_TABLE_SUCCESS:
            const stateBeforeAddTable = Object.assign({}, state);
            const dbTabIndex = stateBeforeAddTable.dbsources.findIndex(dbs => dbs.id === (action.payload as any).dbsourceId);
            const tab = { ...action.payload.table };
            tab.constraints = action.payload.constraints;
            tab.indexes = action.payload.indexes;
            stateBeforeAddTable.dbsources[dbTabIndex].databases[0].tables.push(tab);
            return stateBeforeAddTable;
        case dbsource.DROP_COLLECTION_SUCCESS:
            const stateBeforeDrop = Object.assign({}, state);
            const dbsIndex = stateBeforeDrop.dbsources.findIndex(dbs => dbs.id === (action.payload as Collection).dbsourceId);
            const dbndex = stateBeforeDrop.dbsources[dbsIndex].databases.findIndex(db => db.name === (action.payload as Collection).databaseName);
            stateBeforeDrop.dbsources[dbsIndex].databases[dbndex].collections = stateBeforeDrop.dbsources[dbsIndex].databases[dbndex].collections.filter(coll => coll !== (action.payload as Collection).collectionName);
            return stateBeforeDrop;
        case dbsource.UPDATE_COLLECTION_SUCCESS:
            const stateBeforeUpdate = Object.assign({}, state);
            const dbsIndexToUpdate = stateBeforeUpdate.dbsources.findIndex(dbs => dbs.id === (action.payload as Collection).dbsourceId);
            const dbIndexToUpdate = stateBeforeUpdate.dbsources[dbsIndexToUpdate].databases.findIndex(db => db.name === (action.payload as Collection).databaseName);
            const collectionIndexToUpdate = stateBeforeUpdate.dbsources[dbsIndexToUpdate].databases[dbIndexToUpdate].collections.findIndex(coll => coll === (action.payload as Collection).collectionName);
            stateBeforeUpdate.dbsources[dbsIndexToUpdate].databases[dbIndexToUpdate].collections[collectionIndexToUpdate] = (action.payload as Collection).newCollectionName;
            return stateBeforeUpdate    
        case dbsource.UPDATE_COLLECTION_CUSTOMQUERY_SUCCESS:
            const stateBeforeUpdateCustomQuery = Object.assign({}, state);
            const dbsIndexToUpdateCustomQuery = stateBeforeUpdateCustomQuery.dbsources.findIndex(dbs => dbs.id === (action.payload as Collection).dbsourceId);
            const dbIndexToUpdateCustomQuery = stateBeforeUpdateCustomQuery.dbsources[dbsIndexToUpdateCustomQuery].databases.findIndex(db => db.name === (action.payload as Collection).databaseName);
            const collectionIndexToUpdateCustomQuery = stateBeforeUpdateCustomQuery.dbsources[dbsIndexToUpdateCustomQuery].databases[dbIndexToUpdateCustomQuery].collections.findIndex(coll => coll === (action.payload as Collection).collectionName);
            stateBeforeUpdateCustomQuery.dbsources[dbsIndexToUpdateCustomQuery].databases[dbIndexToUpdateCustomQuery].collections[collectionIndexToUpdateCustomQuery] = (action.payload as Collection).newCollectionName;
            return stateBeforeUpdateCustomQuery;
        case dbsource.DROP_TABLE_SUCCESS:
            const stateBeforeDropTable = Object.assign({}, state);
            const dbsTabIndex = stateBeforeDropTable.dbsources.findIndex(dbs => dbs.id === (action.payload as any).dbsourceId);
            stateBeforeDropTable.dbsources[dbsTabIndex].databases[0].tables = stateBeforeDropTable.dbsources[dbsTabIndex].databases[0].tables.filter(coll => coll !== (action.payload as any).tableName);
            return stateBeforeDropTable;
        case globalActions.EFFECT_ERROR:
            return Object.assign({}, state);

        default:
            return state;
    }
}
