import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Project } from 'src/app/shared/models/Project';

import { Store } from '@ngrx/store';
import { ProjectsState } from '../store/project/project.state';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  token: string;

  baseUrl: string = environment.baseUrl + '/api/project';
  dockerBaseUrl: string = environment.baseUrl + '/api/docker';

  constructor(private store: Store<ProjectsState>, private http: HttpClient) {

  }

  /**
   * Check a Project's Name Unicity
   * @param name The Name to Check in Database
   */
  public checkProjectNameUnicity(name: string, id: string): Observable<boolean> {
    let param = '/check/' + name;
    if (id) {
      param = '/check/' + name + '/' + id;
    }
    return this.http.get<boolean>(this.baseUrl + param);
  }

  /**
   * Check git credentials before saving project
   */
  checkGitcredentials(obj: Project) {
    return this.http.post<boolean>(this.baseUrl + '/git/check', obj);
  }

  /**
   * Synchronize git content
   */
  syncgit(obj: Project, files) {
    const formData: FormData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return this.http.post<any>(this.baseUrl + '/git/sync', obj);
  }

  /**
   * Fetch All Projects to Display on the sidenav Bar
   */
  public getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl + '/all');
  }

  /**
   * Fetch a Project By it's Uuid
   * @param projectUid to Fetch the Project By Id
   */
  public getProjectByUid(projectUid: string): Observable<Project> {
    return this.http.get<Project>(this.baseUrl + '/' + projectUid);
  }

  /**
   * Fetch  Projects By their microservice type
   * @param projectType to Fetch the Project By type
   */
  public getProjectByType(projectType: string): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl + '/getByType/' + projectType);
  }

  /**
   * Save a new project from a filled form
   * @param obj Project Object with Details
   */
  public createProject(obj: Project): Observable<Project> {
    return this.http.post<Project>(this.baseUrl + '/create', obj);
  }

  /**
   * Update an existing project with new informations
   * @param proj The new Project's Details
   */
  public updateProject(proj: Project) {
    return this.http.put(this.baseUrl + '/update/' + proj.id, proj);
  }

  /**
   * Delete a project by it's uuid
   * @param id to Fetch the Project By Id
   */
  public deleteProjectById(id: string) {
    return this.http.delete(this.baseUrl + '/delete/' + id);
  }

  // Docker export API

  public exportDocker(dockerExport, containerId) {
    return this.http.post(this.dockerBaseUrl + '/export/' + containerId, dockerExport);
  }

  public findDockerExportsByUser(projectId) {
    return this.http.get<any>(this.dockerBaseUrl + '/findAll/' + projectId);
  }

  public findDockerExportsById(dockerExportId) {
    return this.http.get<any>(this.dockerBaseUrl + '/find/' + dockerExportId);
  }

  public updateDockerState(dockerExport) {
    return this.http.post<any>(this.dockerBaseUrl + '/update', dockerExport);
  }

  public deleteDocker(dockerExport) {
    return this.http.delete<any>(this.dockerBaseUrl + '/delete/' + dockerExport.id);
  }

  public getRoles(rolesUrl, clientId, clientSecret) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('client_id', clientId);
    queryParams = queryParams.append('client_secret', clientSecret);
    return this.http.get<string[]>(rolesUrl + '/getroles', { params: queryParams });
  }

  public addApp(id, appName): Observable<Project> {
    return this.http.post<any>(this.baseUrl + '/addApp/' + id, appName);
  }

  public deleteApp(id, clientId): Observable<Project> {
    return this.http.get<any>(this.baseUrl + '/deleteApp/' + id + '/' + clientId);
  }
}
