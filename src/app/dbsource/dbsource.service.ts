import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DBSource } from '../shared/models/DBSource';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IndexCollection } from '../shared/models/IndexCollection';


@Injectable({
    providedIn: 'root'
})

export class DBSourceService {
   

    private baseUrl: string = environment.baseUrl + '/api/dbsource';
    private baseUrl2: string = environment.baseUrl + '/api/container';
    constructor(private http: HttpClient) { }

    /**
     * Check whether the given information is correct or not
     * @param dbSource The details of the new DataSource to Create
     */
    public checkConnection(dbSource: DBSource): Observable<boolean> {
        return this.http.post<boolean>(this.baseUrl + '/check', dbSource);
    }

     public checkConnectionBigquery(file: File): Observable<boolean> {
        const formData: FormData = new FormData();
        formData.append('file', file);
        return this.http.post<boolean>(this.baseUrl + '/checkBigquery', formData );     
     }
    

    public getCollectionAttributes(dbsourceId, databaseName, collectionName) {
        return this.http.get<any>(this.baseUrl + '/collection/' + dbsourceId + '/' + databaseName + '/' + collectionName);
    }


    /**
     * Check whether the given name is unique or not
     * @param dbSource The details of the new DataSource to Create
     */
    public checkUnicity(dbSourceName: string, dbSourceId: string): Observable<boolean> {
        return this.http.get<boolean>(this.baseUrl + '/check/name/' + dbSourceName + '/' + dbSourceId);
    }

    /**
     * Save a DBSource Instance in Database
     * @param dbSource the new user Input
     */
    public saveDBSource(dbSource: DBSource): Observable<DBSource> {
        return this.http.post<DBSource>(this.baseUrl + '/create', dbSource);
    }

    /**
     * Update a DBSource Instance
     * @param dbSource the new user Input
     */
    public updateDBSource(dbSource: DBSource): Observable<DBSource> {
        return this.http.post<DBSource>(this.baseUrl + '/create', dbSource);
    }

        /**
     * Update a DBSource bigquery Instance
     * @param dbSource the new user Input
     */
        
        public saveDBSourceBigquery(dbSource: DBSource,file: File): Observable<DBSource> {
            const formData: FormData = new FormData();
            formData.append('file', file);
            formData.append('dbSource', JSON.stringify(dbSource)); 
            return this.http.post<DBSource>(this.baseUrl + '/createBigQuery', formData);
        }

        public updateDBSourceBigQuery(dbSource: DBSource,file: File): Observable<DBSource> {
            const formData: FormData = new FormData();
            formData.append('file', file);
            formData.append('dbSource', JSON.stringify(dbSource)); 
            return this.http.post<DBSource>(this.baseUrl + '/createBigQuery', formData);
        }

    /**
     * Retrieve a DBSource Instance from a DB based on the Given Id
     * @param dbSourceId (If of the DBSource to retrieve)
     */
    public getDBSourceById(dbSourceId: string): Observable<DBSource> {
        return this.http.get<DBSource>(this.baseUrl + '/' + dbSourceId);
    }

    /**
     * Retrieve all Datasources from DB
     */
    public getAll() {
        return this.http.get<DBSource[]>(this.baseUrl + '/all');
    }

    /**
     * Delete a Datasource based on the Given Id
     * @param dbsourceId : ID of the Datasource to Delete
     */
    public deleteDBSource(dbsourceId: string) {
        return this.http.delete(this.baseUrl + '/delete/' + dbsourceId);
    }

    public getCollectionStats(dbsourceId: string, databaseName: string, collectionName: string) {
        return this.http.get(this.baseUrl + '/stats/' + dbsourceId + '/' + databaseName + '/' + collectionName);
    }

    public dropCollection(dbsourceId: string, databaseName: string, collectionName: string) {
        return this.http.delete(this.baseUrl + '/drop/' + dbsourceId + '/' + databaseName + '/' + collectionName);
    }

    /** Add a New Collection To A Database */
    public saveNewCollection(containerId: string, collectionName: string): Observable<boolean> {
        return this.http.post<boolean>(this.baseUrl + '/addcollection/' + containerId + '/' + collectionName, {});
    }

    /** update a Collection Name*/
    public updateCollection(dbsourceId: string, databaseName: string, oldCollectionName: string, newCollectionName: string): Observable<boolean> {
        return this.http.put<boolean>(this.baseUrl + '/updatecollection/' + dbsourceId + '/' + databaseName + '/' + oldCollectionName + '/' + newCollectionName, {});
        
    }

    /** update Collection Name in customQuery*/
    public updateCollectionNameCustomQuery(dbsourceId: string, databaseName: string, oldCollectionName: string, newCollectionName: string): Observable<boolean> {
       
       return this.http.put<boolean>(this.baseUrl2 + '/updateCollectionNameCustomQuery/' + oldCollectionName + '/' + newCollectionName, {});        
        
    }
    /** Fetch if collectionName is used with a container */
    public getCollectionStatUsed(collectionName: string) {
        return this.http.get<boolean>(this.baseUrl2 + '/statCollection/' + collectionName);
      }

    public executeQuery(customQuery,dbsourceId): Observable<boolean> {
        return this.http.post<any>(this.baseUrl + '/query/' + dbsourceId, customQuery);
    }

    public executeDeleteQuery(customQuery,dbsourceId): Observable<boolean> {
        return this.http.post<any>(this.baseUrl + '/deleteTable/' + dbsourceId, customQuery);
    }
    public uploadCSVfile(file: File, dbSourceId: string, collection: string, database: string, replaceData: boolean, csvFormat: string): Observable<string> {
        const formData: FormData = new FormData();
        formData.append('file', file);
        return this.http.post(this.baseUrl + '/saveCSVtodatabase/' + dbSourceId + '/' + collection+ '/' + database+ '/'+ replaceData + '/' + csvFormat
        , formData, {responseType: 'text'});
      }
   

      public getCollectionIndexes(dbsourceId: string, databaseName: string, collectionName: string): Observable<IndexCollection[]> {
        return this.http.get<IndexCollection[]>(this.baseUrl+'/getCollectionIndexes/' + dbsourceId + '/' + databaseName + '/' + collectionName);
      }

      public dropCollectionIndex(dbsource: string, databaseName: string, collectionName: string, indexName: string) {
        return this.http.delete(this.baseUrl + '/deleteCollectionIndex/' + dbsource+ '/' + databaseName + '/' + collectionName+ '/' + indexName);
        
      }

     public getCollectionFields(dbsourceId: string, databaseName: string, collectionName: string) {
        return this.http.get<String[]>(this.baseUrl + '/collectionFields/' + dbsourceId + '/' + databaseName + '/' + collectionName);
    }
    
    public createCollectionIndex(dbsourceId: string, databaseName: string, collectionName: string, indexRequest: IndexCollection) {
        return this.http.post(this.baseUrl + '/createCollectionIndex/' + dbsourceId + '/' + databaseName + '/' + collectionName,indexRequest);
      }
}
