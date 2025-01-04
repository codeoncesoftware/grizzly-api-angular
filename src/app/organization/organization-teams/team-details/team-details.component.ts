import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { OrganizationsState } from 'src/app/store/organization/organization.state';
import { TeamService } from '../team.service';
import { MessageService } from 'src/app/shared/message-modal/message.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationService } from '../../organization-menu/organization.service';
import { Store } from '@ngrx/store';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TeamModalComponent } from '../team-modal/team-modal.component';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import * as organizationActions from '../../../store/organization/organization.actions';
import { TeamsState } from 'src/app/store/team/team.state';
@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss']
})
export class TeamDetailsComponent implements OnInit {



  myControl = new UntypedFormControl();
  emails: string[] = [];
  filteredOptions: Observable<string[]>;
  @ViewChild('memberInput', { static: false }) memberInput: ElementRef<HTMLInputElement>;
  emailFormatValid = true;
  organizationNameAbrev: string;
  organizationMembers: any[] = [];
  team: any = {};
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  members: any[] = [];
  teamMembers: any[] = [];
  organization: any;

  constructor(private store: Store<OrganizationsState>,
              private teamService: TeamService,
              public activatedRoute: ActivatedRoute,
              private messageBoxService: MessageService,
              public organizationService: OrganizationService,
              public dialog: MatDialog,
              private teamStore: Store<TeamsState>
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new organizationActions.LoadAllOrganizations([{}]));
    const accessor = 'organization';
    this.store.select(accessor).subscribe(state => {
      if (state[accessor].length !== 0) {
        this.organization = state[accessor][0];
        this.organizationNameAbrev = (this.organization.name).substr(0, 2).toUpperCase();
        this.activatedRoute.params.subscribe(params => {
          this.teamService.getMembersByTeam(params.id).subscribe((res: any[]) => {
            this.teamMembers = res;
          });
          const teamAccessor = 'team';
          this.teamStore.select(teamAccessor).subscribe(teamState => {
            this.team = teamState[teamAccessor][0];
          });
          this.teamService.getTeam(params.id).subscribe(team => {
            this.team = team;
          });
        });
        this.organizationService.getMembersOrganizationById(this.organization.id).subscribe(members => {
          members.forEach(member => {
            this.emails.push(member.email);
          });
        });
      }
    });
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    const emails = [];
    this.emails.forEach(option => {
      if (option.toLowerCase().includes(filterValue) && !emails.some(el => el === option) && !this.teamMembers.some(el => el.email === option)) {
        emails.push(option);
      }
    });
    return emails;
  }

  invite() {
    this.members.forEach(member => {
      this.organizationService.checkMemberIsUser(member.name).subscribe(isUser => {
        if (isUser) {
          this.organizationService.checkMemberInCurrentOrganization(this.organization.id, member.name).subscribe(res => {
            if (res) {
              this.teamService.addMemberToTeam(this.team.id, member.name).subscribe((newMember: any) => {
                this.team.totalMembers++;
                this.teamService.updateTeam(this.team, this.team.id).subscribe(result => {
                  if (!this.teamMembers.some(m => m.email === newMember.email)) { this.teamMembers.push(newMember); }
                  this.members.length = 0;
                });
              });
            }
          });
        }
      });
    });
  }
  deleteMemberFromTeam(email) {
    this.messageBoxService.openWarning('popups.member.delete.title', 'popups.member.delete.msg',
      {
        info: {
          msg: 'messageBox.member.delete',
        }
      }).afterClosed().subscribe((data) => {
        if (data) {
          this.teamService.deleteMemberFromTeam(this.team.id, email).subscribe(res => {
            this.team.totalMembers--;
            this.teamService.updateTeam(this.team, this.team.id).subscribe(result => {
              const index = this.teamMembers.findIndex(t => t.email === email);
              this.teamMembers.splice(index, 1);
              this.members.length = 0;
            });
          });
        }
      });
  }
  editTeam() {
    this.dialog.open(TeamModalComponent,
      { // Modal configuration
        width: '70%',
        height: '90vh',
        position: {
          top: '9vh'
        },
        data: {
          team: this.team,
          organization: this.organization,
          action: {
            update: true,
            create: false,
            msg: 'popups.team.edit'
          }
        },
      });
  }


  add(event: MatChipInputEvent): void {

    this.emailFormatValid = true;
    const input = event.input;
    const value = event.value;
    // Add our member
    if ((value || '').trim()) {
      const patt = new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}');
      if (!patt.test(value.trim())) {
        this.emailFormatValid = false;
        return;
      }

      this.members.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  addOption(option) {

    if ((option || '').trim() && (!this.members.some(member => member.name === option))) {
      this.members.push({ name: option.trim() });
      this.memberInput.nativeElement.value = '';
    } else {
      this.memberInput.nativeElement.value = '';
    }
  }

  remove(fruit: any): void {
    const index = this.members.indexOf(fruit);

    if (index >= 0) {
      this.members.splice(index, 1);
    }
  }
}
