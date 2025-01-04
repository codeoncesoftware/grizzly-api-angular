import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Organization } from 'src/app/shared/models/Organization';


@Injectable({
    providedIn: 'root'
})
export class TeamService {

    baseUrl: string = environment.baseUrl + '/api/user';
    membersUrl: string = environment.baseUrl + '/api/member';
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
    };

    constructor(private http: HttpClient) { }


    public addTeam(team: any) {
        return this.http.post(this.baseUrl + '/teams/' + localStorage.getItem('userEmail'), JSON.stringify(team), this.httpOptions);
    }
    public getTeam(id) {
        return this.http.get(this.baseUrl + '/team/' + id);
    }
    public getMembersByTeam(teamId) {
        return this.http.get(this.membersUrl + '/findByTeam/' + teamId);
    }
    public updateMember(member, memberId) {
        return this.http.put(this.membersUrl + '/update/' + memberId, JSON.stringify(member), this.httpOptions);
    }
    public updateTeam(team, teamId) {
        return this.http.put(this.baseUrl + '/updateTeam/' + teamId, JSON.stringify(team), this.httpOptions);
    }
    public deleteTeam(teamId) {
        return this.http.delete(this.baseUrl + '/teams/delete/' + teamId);
    }
    public addMemberToTeam(id, email) {
        return this.http.get(this.membersUrl + '/addMemberToTeam/' + id + '/' + email);
    }
    public deleteMemberFromTeam(id, email) {
        return this.http.delete(this.baseUrl + '/deleteMemberFromTeam/' + id + '/' + email);
    }

}
