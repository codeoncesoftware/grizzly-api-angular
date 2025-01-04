import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../shared/models/User';
import { TranslateService } from '@ngx-translate/core';
import { GrizzlyAiService } from 'src/app/grizzly-ai/grizzly-ai.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient, private router: Router, private translateService: TranslateService, private grizzlyaiService: GrizzlyAiService) { }

  login(userObj) {
    return this.http.post<string>(this.baseUrl + '/api/auth/login', userObj, { responseType: 'json' });
  }

  logout() {
    this.http.get<boolean>(this.baseUrl + '/api/auth/logout').subscribe(res => {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('token');
      localStorage.removeItem('myTeamsIds');
      localStorage.removeItem('threadId');
      localStorage.removeItem('conversation');
      localStorage.removeItem('listeMS');
      this.router.navigate(['/login']);
    });
  }

  redirectGithubLoginPage() {
    console.log(window.location.href = environment.GITHUB_AUTHORIZE_URL + '?client_id=' + environment.GITHUB_CLIENT_ID + '&reditect_uri=' + environment.GITHUB_REDIRECT_URI + '&scope=user:email');
    window.location.href = environment.GITHUB_AUTHORIZE_URL + '?client_id=' + environment.GITHUB_CLIENT_ID + '&reditect_uri=' + environment.GITHUB_REDIRECT_URI + '&scope=user:email';
  }

  redirectGoogleLoginPage() {
    window.location.href = environment.GOOGLE_AUTHORIZE_URL + '?client_id=' + environment.GOOGLE_CLIENT_ID + '&redirect_uri=' + environment.GOOGLE_REDIRECT_URI + '&response_type=code'+ '&scope=email profile';
  }

  githubLogin(code) {
    return this.http.get(this.baseUrl + '/api/auth/github/login', { params: { code } });
  }

  googleLogin(code, scope, authuser, prompt) {
    return this.http.get(this.baseUrl + '/api/auth/google/login', { params: { code, scope, authuser, prompt } });
  }
  getUserFromGAuthServer(email): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/api/check/user/' + email);
  }

  signup(userObj) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': this.translateService.getDefaultLang()
    });
    return this.http.post<string>(this.baseUrl + '/api/auth/signup', userObj, { headers });
  }

  check(email: string) {
    return this.http.get<boolean>(this.baseUrl + '/api/auth/check/' + email);
  }

  sendResetEmail(email: string, lang: string) {
    const headers = new HttpHeaders({
      'Accept-Language': lang
    });
    return this.http.get(this.baseUrl + '/api/auth/send/reset/password/' + email, { headers });
  }

  resetPassword(token, password) {
    return this.http.post(this.baseUrl + '/api/auth/reset/password/' + token, { password });
  }

  confirmEmail(token) {
    return this.http.get(this.baseUrl + '/api/auth/confirm/email/' + token);
  }

  checkNewsletter(email) {
    return this.http.get(this.baseUrl + '/api/auth/checknewsletter/' + email);
  }

  getUser(email): Observable<any> {
    this.fetchThreadId();
    return this.http.get<any>(this.baseUrl + '/api/user/' + email);
  }

  updateProfile(user): Observable<User> {
    return this.http.put<User>(this.baseUrl + '/api/user/update', user);
  }

  updatePassword(oldPwd, newPwd) {
    return this.http.put(this.baseUrl + '/api/user/update/pwd', {}, { params: { oldPwd, newPwd } });
  }

  checkToken(token): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + '/api/auth/check/token/' + token);
  }
  getTeams() {
    return this.http.get(this.baseUrl + '/api/user/teams');
  }
  addTeam(team) {
    return this.http.post(this.baseUrl + '/api/user/teams', team);
  }
  getUsersByTeam() {
    return this.http.get(this.baseUrl + '/api/user/teammates');
  }
  getSubsribedUsersByMicroserviceId(id) {
    return this.http.get(this.baseUrl + '/api/subscription/findByMicroserviceId/' + id);
  }

  getAllUsers() {
    return this.http.get<User[]>(this.baseUrl + '/api/user/all');
  }

  sendInvitation(userEmails, lang, orgId, orgName) {
    const headers = new HttpHeaders({
      'Accept-Language': lang
    });
    return this.http.post<any>(this.baseUrl + '/api/user/invite', userEmails, { headers, params: { orgId, orgName } });
  }

  sendOrganizationInvitationToExistedUser(userEmails, lang, orgId, orgName) {
    const headers = new HttpHeaders({
      'Accept-Language': lang
    });
    return this.http.post<any>(this.baseUrl + '/api/user/mailOrganization', userEmails, { headers, params: { orgId, orgName } });
  }

  integrate(containerId, email) {
    const intObj = {
      containerId,
      email
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.post<boolean>(this.baseUrl + '/api/auth/integrate', intObj, { headers });
  }
  getUsersEmails() {
    return this.http.get<string[]>(this.baseUrl + '/api/user/emails');
  }
  getGrizzlyHubUser(email) {
    return this.http.get(this.baseUrl + '/api/user/grizzlyhub/user/' + email);
  }

  fetchThreadId() {
    if (!localStorage.getItem('threadId')) {
      this.grizzlyaiService.getthread().subscribe(
        response => {
          const threadId = response.threadId;
          if (threadId) {
            localStorage.setItem('threadId', threadId);
          } else {
            console.error('Impossible de récupérer de threadId');
          }
        },
        error => {
          console.error('Erreur lors de la récupération de threadId :', error);
        }
      );
    }
  }

}
