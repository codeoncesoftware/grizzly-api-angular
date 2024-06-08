import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FetchFunctionsRequest } from '../shared/models/FetchFunctionsRequest';
import { Function } from '../shared/models/Function';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  /* add function to resource */
  addFunction() {
    return this.http.post<any>(this.baseUrl + '/api/function/add', { order: 0, containerId: '607589da9fd73c590d0581db', name: 'test', resPath: '/aaaa', type: 'output' });
  }

  /* create new function for container */
  createFunction(f: any) {
    return this.http.post<any>(this.baseUrl + '/api/function/create', f);
  }


  /* get all functions by container */
  getFunctionByContainer(containerId: string) {
    return this.http.get<Array<any>>(this.baseUrl + '/api/function/get/all/container/' + containerId);
  }

  /* get all functions by project */
  getFunctionsByProject(projectId: string) {
    return this.http.get<Array<any>>(this.baseUrl + '/api/function/get/all/project/' + projectId);
  }

  /* get function by the name */
  getFunctionByName(id: string, name: string) {
    return this.http.get<any>(this.baseUrl + '/api/function/get/' + id + '/' + name);
  }

  /* get function by the id */
  getFunctionById(id: string, name: string) {
    return this.http.get<any>(this.baseUrl + '/api/function/get/' + id);
  }

  /* get function by the resource */
  getFunctionsByResource(f: FetchFunctionsRequest) {
    return this.http.post<any>(this.baseUrl + '/api/function/get', f);
  }

  /* delete function by the id */
  deleteFunction(projectId: string, name: string, version: string) {
    return this.http.delete<any>(this.baseUrl + '/api/function/delete/' + projectId + '/' + name + '/' + version);
  }


  /* update function  */
  updateFunction(projectId: string, name: string, version: string, f: any) {
    return this.http.put<any>(this.baseUrl + '/api/function/update/' + projectId + '/' + name + '/' + version, f);
  }

  /* get function by the name */
  cloneFunction(projectId: string, name: string, version: string, newVersion: string) {
    return this.http.post<any>(this.baseUrl + '/api/function/clone/' + projectId + '/' + name + '/' + version, newVersion);
  }








}
