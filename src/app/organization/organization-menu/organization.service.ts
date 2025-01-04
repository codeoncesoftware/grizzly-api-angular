import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Organization } from 'src/app/shared/models/Organization';


@Injectable({
    providedIn: 'root'
})
export class OrganizationService {

    membersUrl: string = environment.baseUrl + '/api/member';
    organizationsUrl: string = environment.baseUrl + '/api/organisation';
    authUrl: string = environment.baseUrl + '/api/user';
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    };

    constructor(private http: HttpClient) { }

    public getOrganisation(): Observable<any> {
        return this.http.get(this.membersUrl + '/currentUserOrganisation');
    }
    public getMembersOrganizationById(id) {
        return this.http.get<any>(this.membersUrl + '/findByOrganisation/' + id);
    }
    public checkOrganisationUnicity(name) {
        return this.http.get(this.organizationsUrl + '/only/' + name);
    }
    public getTeamsByOrganization(id) {
        return this.http.get(this.authUrl + '/teamsByOrganisationId/' + id);
    }
    public getMyOrganizationTeams() {
        return this.http.get<any>(this.organizationsUrl + '/myOrganisationTeams');
    }
    public addOrganisation(organization: Organization) {
        return this.http.post(this.organizationsUrl + '/add', JSON.stringify(organization), this.httpOptions);
    }
    public updateOrganization(organization: any, id: string) {
        return this.http.put(this.organizationsUrl + '/update/' + id, JSON.stringify(organization), this.httpOptions);
    }
    public deleteOrganisation(id: string) {
        return this.http.delete(this.organizationsUrl + '/delete/' + id, this.httpOptions);
    }
    public addMemberToOrganization(member: any) {
        return this.http.post(this.membersUrl + '/add', JSON.stringify(member), this.httpOptions);
    }
    public deleteMemberFromOrganization(id: string) {
        return this.http.delete(this.membersUrl + '/delete/' + id, this.httpOptions);
    }
    public checkMemberInOrganisation(email) {
        return this.http.get(this.membersUrl + '/membreExistsInMembers/' + email);
    }
    public checkMemberIsUser(email) {
        return this.http.get(this.membersUrl + '/membreExistsInUsers/' + email);
    }
    public checkMemberInCurrentOrganization(organisationId, email) {
        return this.http.get(this.organizationsUrl + '/onlyOrganisationAndEmail/' + organisationId + '/' + email);
    }
    public checkMemberIsAdmin() {
        return this.http.get(this.membersUrl + '/currentUserIsAdmin');
    }
    public getCurrentUserTeams() {
        return this.http.get(this.membersUrl + '/currentUserTeam');
    }
    public getMember(id) {
        return this.http.get(this.membersUrl + '/find/' + id);
    }
    public getMemberByEmail(email) {
        return this.http.get(this.membersUrl + '/memberByEmail/' + email);
    }
    public getOrganizationById(id) {
        return this.http.get(this.organizationsUrl + '/find/' + id);
    }
    public getCurrentUseAndOrganisation(): Observable<any> {
        return this.http.get(this.authUrl + '/');
    }
}
