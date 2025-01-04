import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/shared/message-modal/message.service';
import { OrganizationService } from '../organization-menu/organization.service';
import { OrganizationsState } from 'src/app/store/organization/organization.state';
import { Store } from '@ngrx/store';
import { TeamService } from './team.service';
import { TeamModalComponent } from './team-modal/team-modal.component';
import * as organizationActions from '../../store/organization/organization.actions';
import * as microserviceActions from '../../store/project/project.actions';

import { ProjectsState } from 'src/app/store/project/project.state';
import { AuthState } from 'src/app/store/authentication/auth.state';

@Component({
  selector: 'app-organization-teams',
  templateUrl: './organization-teams.component.html',
  styleUrls: ['./organization-teams.component.scss']
})
export class OrganizationTeamsComponent implements OnInit {

  organization: any;
  organizationNameAbrev: string;
  organizationMembers: any[] = [];
  teams: any[] = [];
  show = false;
  totalTeams = 0;
  constructor(private dialog: MatDialog,
              private store: Store<OrganizationsState>,
              private authStore: Store<AuthState>,
              private messageBoxService: MessageService,
              private teamService: TeamService,
              private organizationService: OrganizationService,
              private storeMs: Store<ProjectsState>) { }

  ngOnInit(): void {
    this.store.dispatch(new organizationActions.LoadAllOrganizations([{}]));
    const accessor = 'organization';
    const userAccessor = 'user';
    this.authStore.select<any>('auth').subscribe(authState => {
      //       if (authState[userAccessor] !== {}) {
      if (Object.keys(authState[userAccessor]).length !== 0) {
        if (authState[userAccessor].isAdmin) {
          this.show = true;
          this.store.select(accessor).subscribe(state => {
            if (state[accessor].length !== 0) {
              this.organization = state[accessor][0];
              this.organizationService.getTeamsByOrganization(this.organization.id).subscribe((teams: any[]) => {
                this.teams = teams;
                this.totalTeams = this.teams.length;
              });
              this.organizationNameAbrev = (this.organization.name).substr(0, 2).toUpperCase();

            }
          });
        }
      }
    });
  }
  // Open the modal with the create organization form
  openDialog(): void {
    this.dialog.open(TeamModalComponent, {
      // Modal configuration
      width: '800px',
      height: '80vh',
      position: {
        top: '9vh'
      },
      data: {
        organization: this.organization,
        teams: this.teams,
        action: {
          update: false,
          create: true,
          msg: 'popups.team.add'
        }
      },
    });
  }
  deleteTeam(id) {
    this.messageBoxService.openWarning('popups.team.delete.title', 'popups.team.delete.msg',
      {
        info: {
          msg: 'messageBox.team.delete',
        }
      }).afterClosed().subscribe((data) => {
        if (data) {
          this.teamService.deleteTeam(id).subscribe(res => {
            this.organization.totalTeams--;

            this.store.dispatch(new organizationActions.UpdateOrganization({ organization: this.organization, id: this.organization.id }));
            this.storeMs.dispatch(new microserviceActions.LoadAllProjects());
            const index = this.teams.findIndex(t => t.id === id);
            this.teams.splice(index, 1);
          });
        }
      });
  }
}
