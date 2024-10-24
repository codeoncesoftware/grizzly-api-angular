import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {IdentityProvider} from '../shared/models/IdentityProvider';


@Injectable({
    providedIn: 'root'
})

export class IdentityProviderService {

    private baseUrl: string = environment.baseUrl + '/api/identityprovider';

    constructor(private http: HttpClient) { }

    public saveIdentityProvider(identityprovider: IdentityProvider): Observable<IdentityProvider> {
        return this.http.post<IdentityProvider>(this.baseUrl + '/create', identityprovider);
    }

    public getIdentityProviderById(identityproviderId: string): Observable<IdentityProvider> {
        return this.http.get<IdentityProvider>(this.baseUrl + '/' + identityproviderId);
    }

  public existsIdentityProviderDisplayedName(displayedName: string): Observable<boolean> {
        return this.http.get<boolean>(this.baseUrl + '/identityProviderDisplayedName/' + displayedName);
    }

    public getIdentityProviderByType(identityproviderName: string): Observable<IdentityProvider[]> {
        return this.http.get<IdentityProvider[]>(this.baseUrl + '/public/' + identityproviderName);
    }

    public getAll() {
        return this.http.get<IdentityProvider[]>(this.baseUrl + '/all');
    }

    public deleteIdentityProvider(identityproviderId: string) {
        return this.http.delete(this.baseUrl + '/delete/' + identityproviderId);
    }


  public checkUnicity(name: string, useremail: string, id: string): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + '/check/name/' + name + '/' + useremail + '/' + id);
    }

  public checkIdentityProviderConnection(
    clientId: string,
    secretKey: string,
    grantType: string,
    issuer: string,
    accessType: string,
    userName: string,
    password: string
  ): Observable<string> {
        const params = new URLSearchParams();
        params.append('client_id', clientId);
        params.append('client_secret', secretKey);
        params.append('grant_type', grantType);
        params.append('issuer', issuer);
        params.append('access_type', accessType);
    params.append('username', userName);
    params.append('password', password);
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    return this.http.post(this.baseUrl + '/checkConnection', params.toString(), {headers, responseType: 'text'});
    }

}
