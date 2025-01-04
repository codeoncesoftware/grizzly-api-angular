import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Container } from '../shared/models/Container';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {


  baseUrl: string = environment.baseUrl;
  projectUuid: string;

  constructor(private http: HttpClient) { }
  /** add function to resource */
  addFunction() {
    return this.http.post<any>(this.baseUrl + '/api/container/clear/', { order: 0, containerId: '607589da9fd73c590d0581db', name: 'test', resPath: '/aaaa', type: 'output' });
  }

  /** delete resources, groups and swaggers */
  clearContainer(id: string) {
    return this.http.get<Container>(this.baseUrl + '/api/container/clear/' + id);
  }

  /** Fetch Container by it's Uuid */
  public getContainerByID(id: string): Observable<Container> {
    return this.http.get<Container>(this.baseUrl + '/api/container/' + id);
  }

  /** Fetch All Containers by project's uuid to Display on the project container */
  public getAllContainers(id: string): Observable<Container[]> {
    return this.http.get<Container[]>(this.baseUrl + '/api/container/project/' + id);
  }

  /** Save a new container for an existing Project */
  public addNewContainer(container: Container): Observable<Container> {
    return this.http.post<Container>(this.baseUrl + '/api/container/create', container);
  }

  /** Check container name unicity */
  public checkNameUnicity(container: Container): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl + '/api/container/check', container);
  }

  /** Delete a container by it's Uuid */
  public deleteContainerById(id: string) {
    return this.http.delete(this.baseUrl + '/api/container/delete/' + id);
  }

  /** Delete all containers for a given Project Id */
  public deleteAllContainers(projectId: string) {
    return this.http.delete(this.baseUrl + '/api/container/deleteAll/project/' + projectId);
  }

  /** Download Generated Swagger */
  public getGeneratedSwagger(containerId: string, mode: string): Observable<HttpResponse<string>> {
    let url;
    if (mode === 'dev') {
      url = this.baseUrl + '/api/swagger/generateswagger/dev/' + containerId;
    } else {
      url = this.baseUrl + '/api/swagger/generateswagger/prod/' + containerId;
    }
    return this.http.get(url,
      {
        observe: 'response',
        responseType: 'text'
      });
  }



  /** Download Generated OpenApi */
  public getGeneratedOpenApi(containerId: string, mode: string): Observable<HttpResponse<string>> {
    let url;
    if (mode === 'dev') {
      url = this.baseUrl + '/api/swagger/generateopenapi/dev/' + containerId;
    } else {
      url = this.baseUrl + '/api/swagger/generateopenapi/prod/' + containerId;
    }
    return this.http.get(url,
      {
        observe: 'response',
        responseType: 'text'
      });
  }

  /** Export ms as docker */
  public exportToDocker(containerId: string): Observable<HttpResponse<string>> {
    return this.http.get<any>(this.baseUrl + '/api/swagger/exportSwaggerToDocker/' + containerId);

  }

  /** Import a Swagger File to be Mapped to New Container */
  public importSwaggerFile(swaggerFile: File, projectId: string, containerName: string): Observable<Container> {

    const formData: FormData = new FormData();
    formData.append('file', swaggerFile);
    formData.append('containerName', containerName);
    formData.append('projectId', projectId);
    return this.http.post<Container>(this.baseUrl + '/api/container/importSwagger', formData);
  }

  /** Enable/Disable container */
  public enableDisableContainer(containerId: string) {
    return this.http.get(this.baseUrl + '/api/container/enableDisable/' + containerId);
  }

  public clone(containerId, newContainerName) {

    return this.http.post<Container>(this.baseUrl + '/api/container/clone/' + containerId, newContainerName);
  }

  public export(containerId: string) {
    return this.http.get(this.baseUrl + '/api/container/export/' + containerId, {
      responseType: 'arraybuffer'
    });
  }

  public exportJsonSwagger(containerId: string) {
    return this.http.get(this.baseUrl + '/api/swagger/public/swagger/' + containerId + '/V2');
  }

  public importContainer(zipFile: File, projectId: string, containerName: string, dbsourceId: string, databaseName: string): Observable<Container> {

    const formData: FormData = new FormData();
    formData.append('file', zipFile);
    formData.append('containerName', containerName);
    formData.append('projectId', projectId);
    formData.append('dbsourceId', dbsourceId);
    formData.append('databaseName', databaseName);

    return this.http.post<Container>(this.baseUrl + '/api/container/import', formData);
  }

  public importSwaggerOnExistingContainer(file: File, idContainer: string, editor: string): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('containerId', idContainer);
    formData.append('editor', editor);

    return this.http.post<string>(this.baseUrl + '/api/container/importSwaggerOnExistingContainer', formData);
  }

  public getSwaggerFileFromUrl(swaggerUrl: string) {
    if ((swaggerUrl.indexOf('http://') !== 0) && (swaggerUrl.indexOf('https://') !== 0)) {
      swaggerUrl = 'http://' + swaggerUrl;
    }
    return this.http.get(swaggerUrl, { responseType: 'text' });
  }

  /**
   * Return the MS version URL to call Server
   * @param containerID to identify the MS version
   */
  getContainerServerUrl(containerID: string): string {
    return this.baseUrl + '/runtime/' + containerID;
  }

  getSwagger(url) {
    return this.http.get(url);
  }

  /** Save a new container for an existing DBsource and without project */
  public addNewContainerWithAbsentProject(container: Container, dbSourceId:string, physicalDatabase:string): Observable<Container> {
    return this.http.post<Container>(this.baseUrl + '/api/container/createContainer/'+dbSourceId+'/'+physicalDatabase, container);
  }

  /** Fetch All Containers by DbSourceId */
  public getAllContainersByDbSourceId(id: string): Observable<Container[]> {
    return this.http.get<Container[]>(this.baseUrl + '/api/container/dbsource/' + id);
  }
}
