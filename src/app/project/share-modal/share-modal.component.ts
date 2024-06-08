import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { OrganizationService } from 'src/app/organization/organization-menu/organization.service';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { DBSourcesState } from 'src/app/store/dbsource/dbsource.state';
import { ProjectsState } from 'src/app/store/project/project.state';
import * as projectActions from '../../store/project/project.actions';
import * as dbsourceActions from '../../store/dbsource/dbsource.actions';
import { IdentityProviderState } from 'src/app/store/identityprovider/identityprovider.state';
import { IdentityProvider } from 'src/app/shared/models/IdentityProvider';
import { IdentityProviderService } from 'src/app/identity-provider/identityprovider.service';
@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss']
})
export class ShareModalComponent implements OnInit {

  public teamsToAdd = [];
  public teams = [];
  showInput = false;
  showNoUsers = false;
  teamName = '';
  project;
  datasource;
  currentIdentityProviders;
  authProject;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private organizationService: OrganizationService,
              private identityProviderService: IdentityProviderService,
              private store: Store<ProjectsState>,
              private datasourceStore: Store<DBSourcesState>,
              private idpStore: Store<IdentityProviderState>,
              public dialogRef: MatDialogRef<ShareModalComponent>,
              private translateService: AppTranslateService,
              private toaster: ToastrService,
              public dialog: MatDialog) {
    this.project = this.data.project;
    this.datasource = this.data.datasource;
    this.currentIdentityProviders = this.data.currentIdentityProviders;
    this.authProject = this.data.authProject;
    this.organizationService.getTeamsByOrganization(this.data.project.organizationId).subscribe((teams: any) => {
      this.teams = teams;
      this.teams.forEach(team => {
        if (this.project.teamIds.findIndex(el => el === team.id) >= 0) {
          this.teamsToAdd.push(team);
        }
      });

    });
  }
  ngOnInit() {

  }

  selectAllTeams() {
    this.teamsToAdd = [];
    this.teamsToAdd = this.teams.slice();
  }

  addTeam(team) {
    const index = this.teams.findIndex(t => t.name === team);
    if (index >= 0) {
      if (!this.teamsToAdd.some(el => el.name === team)) {
        this.teamsToAdd.push(this.teams[index]);
        this.teamName = '';
      }
    }
  }

  deleteTeam(index) {
    if(this.datasource.teamIds !== undefined) {
      if(this.datasource.teamIds.includes(this.teamsToAdd[index].id)) {
        this.datasource.teamIds.splice(this.datasource.teamIds.findIndex(id => id === this.teamsToAdd[index].id), 1);
        this.datasourceStore.dispatch(new dbsourceActions.UpdateDBSource(this.datasource));
      }
    }
    if(this.project.teamIds !== undefined) {
      if(this.project.teamIds.includes(this.teamsToAdd[index].id)) {
        this.project.teamIds.splice(this.project.teamIds.findIndex(id => id === this.teamsToAdd[index].id), 1);
        this.store.dispatch(new projectActions.UpdateProject(this.project, ''));
      }
    }
    if(this.authProject.teamIds !== undefined) {
      if(this.authProject.teamIds.includes(this.teamsToAdd[index].id)) {
        this.authProject.teamIds.splice(this.authProject.teamIds.findIndex(id => id === this.teamsToAdd[index].id), 1);
        this.idpStore.select('identityproviders').subscribe((res: IdentityProvider[]) => {
          this.authProject.identityProviderIds.forEach(idpIDs => {
              // eslint-disable-next-line @typescript-eslint/dot-notation
              const idprovider = res['identityproviders'].find(idp => idpIDs === idp.id);
              if(idprovider !== undefined && idprovider.teamIds.includes(this.teamsToAdd[index].id)) {
                idprovider.teamIds.splice(idprovider.teamIds.findIndex(id => id === this.teamsToAdd[index].id), 1);
                this.identityProviderService.saveIdentityProvider(idprovider).subscribe(p => {if(p) {}})
              }
          })
      })
        this.store.dispatch(new projectActions.UpdateProject(this.authProject, ''));
      }
    }
    if(this.currentIdentityProviders !== undefined) {
      this.currentIdentityProviders.forEach(idp => {
        if(!idp.teamIds.includes(this.teamsToAdd[index].id)) {
          idp.teamIds.splice(idp.teamIds.findIndex(id => id === this.teamsToAdd[index].id), 1);
          this.identityProviderService.saveIdentityProvider(idp).subscribe(p => {if(p) {}})
        }
      });
    }
    this.teamsToAdd.splice(index, 1);
    this.toaster.success(this.translateService.getMessage('project.shared'));
  }

  confirm() {
    if (this.teamsToAdd.length === 0) {
      this.project.teamIds = [];
      this.datasource.teamIds = [];
      this.currentIdentityProviders.teamIds = [];
      this.authProject.teamIds = [];
    } else {
      this.teamsToAdd.forEach(element => {
        if (!this.project.teamIds.some(el => el === element.id)) {
          this.project.teamIds.push(element.id);
          if(Object.keys(this.datasource).length !== 0) {
            this.datasource.teamIds.push(element.id);
            this.datasourceStore.dispatch(new dbsourceActions.UpdateDBSource(this.datasource));
          }
          if(Object.keys(this.authProject).length !== 1) {
            if(!this.authProject.teamIds.includes(element.id)) {
              this.authProject.teamIds.push(element.id);
              this.idpStore.select('identityproviders').subscribe((res: IdentityProvider[]) => {
                this.authProject.identityProviderIds.forEach(idpIDs => {
                    // eslint-disable-next-line @typescript-eslint/dot-notation
                    const idprovider = res['identityproviders'].find(idp => idpIDs === idp.id);
                    if(idprovider !== undefined && !idprovider.teamIds.includes(element.id)) {
                      idprovider.teamIds.push(element.id);
                      this.identityProviderService.saveIdentityProvider(idprovider).subscribe(p => {if(p) {}})
                    }
                })
            })
              this.store.dispatch(new projectActions.UpdateProject(this.authProject, ''));
            }

          }
          if(this.currentIdentityProviders !== undefined) {
            this.currentIdentityProviders.forEach(idp => {
              if(!idp.teamIds.includes(element.id)) {
                idp.teamIds.push(element.id);
                this.identityProviderService.saveIdentityProvider(idp).subscribe(p => {if(p) {}})
              }
            });
          }
        }
      });
    }
    this.store.dispatch(new projectActions.UpdateProject(this.project, ''));
    this.toaster.success(this.translateService.getMessage('project.shared'));
    this.dialogRef.close();
  }
}
