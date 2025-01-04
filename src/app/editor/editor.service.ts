import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Container } from '../shared/models/Container';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept-Language' : localStorage.getItem('grizzly-lang')
    })
};
  baseUrl: string = environment.baseUrl + '/api/auth';
  shareURL: string = environment.baseUrl + '/api/container/public/share';

  constructor(private http: HttpClient) { }

  generateExample() {
    return this.http.post<Container>(this.baseUrl + '/editor/example', {});
  }
  getSwaggerStatus(swagger): Observable<Blob> {
    return this.http.post('https://validator.swagger.io/validator/', (swagger) , { responseType: 'blob' });
  }

  generateNewProject() {
    return this.http.post<Container>(environment.baseUrl + '/api/container/generate-new-container', {});
  }

  generateServerClient(url, spec) {
    return this.http.post<any>(url, {spec});
  }
  share(choice , containerId) {
    return this.http.post(this.shareURL + '/' + containerId, choice ,this.httpOptions);
  }

  cloneProject(projectId,containerId) {
    return this.http.post<Container>(environment.baseUrl + '/api/project/public/clone/'+projectId+'/'+containerId, {});
  }
}
