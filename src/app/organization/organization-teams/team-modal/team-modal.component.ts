import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { OrganizationsState } from 'src/app/store/organization/organization.state';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { TeamService } from '../team.service';
import { ToastrService } from 'ngx-toastr';
import * as organizationActions from '../../../store/organization/organization.actions';
import * as teamActions from '../../../store/team/team.actions';
import { TeamsState } from 'src/app/store/team/team.state';
@Component({
  selector: 'app-team-modal',
  templateUrl: './team-modal.component.html',
  styleUrls: ['./team-modal.component.sass']
})
export class TeamModalComponent implements OnInit {


  team: any = {};
  organizationId: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private store: Store<OrganizationsState>,
              public activatedRoute: ActivatedRoute,
              public dialogRef: MatDialogRef<TeamModalComponent>,
              public dialog: MatDialog,
              private teamService: TeamService,
              private toaster: ToastrService,
              private translateService: AppTranslateService,
              private teamStore: Store<TeamsState>) { }

  ngOnInit(): void {
    this.team = { ...this.data.team };
  }
  generateTrigramme(name) {
    const res = name.split(' ');
    let a = '';
    res.forEach(element => {
      if (element !== '' && a.length < 3) {
        a += element[0].toUpperCase();
      }
    });
    this.team.trigramme = a;
  }

  Save() {
    const teamObj = {
      ...this.team,
      organisationId: this.data.organization.id
    };
    if (this.data.action.create) {
      this.teamService.addTeam(teamObj).subscribe(team => {
        this.data.organization.totalTeams++;
        this.store.dispatch(new organizationActions.UpdateOrganization({ organization: this.data.organization, id: this.data.organization.id }));
        this.data.teams.push(team);
        this.dialogRef.close();
        this.toaster.success(this.translateService.getMessage('toaster.team.added'));
      });
    }
    if (this.data.action.update) {
      this.teamStore.dispatch(new teamActions.UpdateTeam({ team: teamObj, id: this.team.id }));
      this.dialogRef.close();
    }
  }
}
