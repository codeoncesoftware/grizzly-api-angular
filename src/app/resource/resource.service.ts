import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Resource } from '../shared/models/Resource';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * This Service Handles all resources Operations (CRUD)
 */
export class ResourceService {

  constructor(private http: HttpClient) { }

  baseUrl: string = environment.baseUrl;

  public saveResource(resource: Resource) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Resource>(this.baseUrl + '/api/resource/create', resource, httpOptions);
  }

  public getResourcesByGroup(groupUuid: string): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.baseUrl + '/api/resource/getResourcesByGroup/' + groupUuid);
  }

  public deleteResourceByUuid(uuid: string) {
    return this.http.delete(this.baseUrl + '/api/resource/delete/' + uuid);
  }

  /** Save a File in Grid Fs (This is not used for NOW, it was abandoned) */
  public saveFile(resource: File, containerId: string) {
    const formData: FormData = new FormData();
    formData.append('file', resource);
    formData.append('containerId', containerId);
    return this.http.post(this.baseUrl + '/api/resource/uploadFile', formData);
    // formData.append('contentType', resource.type);
    // const req = new HttpRequest('POST', this.baseUrl + '/api/resource/uploadFile', formData, {
    //   reportProgress: true,
    //   responseType: 'text'
    // });
    // return this.http.request(req);
  }

  /** Delete a File from GridFs based on it's Id */
  public deleteFile(containerId: string, idFile: string) {
    return this.http.delete(this.baseUrl + '/api/resource/delete/' + containerId + '/' + idFile);
  }

  /** Import a Remote Git Repository and get it's hierarchy */
  public importGitRepository(gitRepoUrl: string, branch: string, projectId: string, containerId: string, dbsourceId: string, databaseName: string, gitUsername: string, gitPassword: string) {
    return this.http.post(this.baseUrl + '/api/resource/importGitProject', {gitRepoUrl, branch, projectId,containerId, dbsourceId, databaseName, gitUsername, gitPassword }, { params: {} });
  }

  public syncGit(files,gitRepoUrl: string, branch: string, projectId: string,containerId: string,swaggerUuid: string, dbsourceId: string, databaseName: string, gitUsername: string, gitPassword: string) {
    const formData: FormData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('containerId', containerId);
    formData.append('projectId', projectId);
    formData.append('dbsourceId', dbsourceId);
    formData.append('databaseName', databaseName);
    formData.append('gitUsername', gitUsername);
    formData.append('gitPassword', gitPassword);
    formData.append('swaggerUuid', swaggerUuid);
    formData.append('branch', branch);
    formData.append('gitRepoUrl', gitRepoUrl);
    return this.http.post(this.baseUrl + '/api/resource/sync', formData);
  }

  public pullFromGitRepository(files,gitRepoUrl: string, branch: string, containerId: string,swaggerUuid: string, dbsourceId: string, databaseName: string, gitUsername: string, gitPassword: string) {
    const formData: FormData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('containerId', containerId);
    formData.append('dbsourceId', dbsourceId);
    formData.append('databaseName', databaseName);
    formData.append('gitUsername', gitUsername);
    formData.append('gitPassword', gitPassword);
    formData.append('swaggerUuid', swaggerUuid);
    formData.append('branch', branch);
    formData.append('gitRepoUrl', gitRepoUrl);
    return this.http.post(this.baseUrl + '/api/resource/pull', formData);
  }
  /** Send a ZIP File to the server to parse and get it's hierarchy */
  public importZipFile(zipFile: File, idContainer: string, dbsourceId: string, databaseName: string): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('zipFile', zipFile);
    formData.append('idContainer', idContainer);
    formData.append('dbsourceId', dbsourceId);
    formData.append('databaseName', databaseName);
    return this.http.post<string>(this.baseUrl + '/api/resource/importZipProject', formData);
  }

  /** Get List of all the branch for a given repository url */
  public getBranchsList(gitRepoUrl: string, gitUsername: string, gitPassword: string, gitToken: string) {
    return this.http.post(this.baseUrl + '/api/resource/getbranchslist', { gitRepoUrl,  gitUsername, gitPassword,gitToken}, { params: { }, headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }

  /** Get a file from a gridFs based on a file Id */
  public getFileLink(fileId: string) {

    // const httpOptions = {
    //   responseType  : 'arraybuffer' as 'json'
    // };
    // return this.http.get(this.baseUrl + '/api/resource/getResourceFile/' + fileId, httpOptions);
  }

  /**
   * Execute API Call
   * @param containerId To Fetch The Container
   * @param path of The API To Execute
   * @param executionType to Distinguish the API
   */
  public execute(containerId, path, executionType) {
    return this.http.post(this.baseUrl + '/runtime/' + containerId + path, {}, { responseType: 'text' });
  }

  public toggleJwt(resource: Resource) {
    // TODO
    // this.confirmModalService.openConfirm('popups.resource.jwt.title',
    //   resource.secured ? 'popups.resource.jwt.disable' : 'popups.resource.jwt.enable')
    //   .afterClosed().subscribe(res => {
    //     if (res) {
    //       const msg = 'API secured';
    //       this.store.dispatch(new containerActions.UpdateContainer(this.container, msg));
    //     }
    //   });
  }

  /**
   * Delete every file related to the given container ID
   *
   * @param containerId to be used for files metadate fetch
   */
  public deleteFiles(containerId: string) {
    return this.http.delete(this.baseUrl + '/api/resource/delete/' + containerId);
  }

}
