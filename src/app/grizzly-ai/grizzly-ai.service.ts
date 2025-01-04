import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrizzlyAiService {

  private baseUrl: String = environment.baseUrl + '/openai';

  constructor(private http: HttpClient) { }

  chat(userMessage: string): Observable<any> {
    const threadId = localStorage.getItem('threadId');
    return this.http.post<any>(this.baseUrl + '/chat', { message: userMessage, threadId: threadId });
  }

  // Create a new thread for the conversation 
  getthread(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });
    const userEmail = localStorage.getItem('userEmail');
    headers = headers.set('userEmail', userEmail);
    return this.http.get<any>(this.baseUrl + '/thread', { headers });
  }



}