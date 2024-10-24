import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Store } from '@ngrx/store';
import { OrganizationsState } from 'src/app/store/organization/organization.state';
import { OrganizationService } from '../organization-menu/organization.service';
import { MessageService } from 'src/app/shared/message-modal/message.service';
import { ToastrService } from 'ngx-toastr';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import * as organizationActions from '../../store/organization/organization.actions';
import { UntypedFormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { map, startWith } from 'rxjs/operators';
import { TeamService } from '../organization-teams/team.service';

@Component({
  selector: 'app-organization-members',
  templateUrl: './organization-members.component.html',
  styleUrls: ['./organization-members.component.scss'],
})
export class OrganizationMembersComponent implements OnInit, AfterViewChecked {
  @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement>;
  myControl = new UntypedFormControl();
  emails: string[] = [];
  filteredOptions: Observable<string[]>;
  organization: any;
  organizationNameAbrev: string;
  organizationMembers: any[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  members: any[] = [];
  notUsers: any[] = [];
  emailFormatValid = true;
  disableMember = true;
  adminNote = false;
  inOrganizationMembers: any[] = [];
  constructor(
    private messageBoxService: MessageService,
    private store: Store<OrganizationsState>,
    private organizationService: OrganizationService,
    private toaster: ToastrService,
    private translateService: AppTranslateService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private teamService: TeamService,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new organizationActions.LoadAllOrganizations([{}]));
    const accessor = 'organization';
    this.store.select(accessor).subscribe((state) => {
      if (state[accessor].length !== 0) {
        this.organization = state[accessor][0];
        this.organizationService
          .getMembersOrganizationById(this.organization.id)
          .subscribe((data: any[]) => {
            this.organizationMembers = data;
            this.onlyOneAdmin();
          });
        this.organizationNameAbrev = this.organization.name
          .substr(0, 2)
          .toUpperCase();


      }
    });
    this.authService.getUsersEmails().subscribe(emails => {
      emails.forEach(email => {
        this.emails.push(email);
      });
    });

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  onlyOneAdmin(): boolean {
    let nb = 0;
    let i = 0;
    this.disableMember = true;
    if (this.organizationMembers.length > 0) {
      this.organizationMembers.forEach(Orgmember => {
        i++;
        if (Orgmember.role === 'admin') {
          nb++;
          if (nb > 1) {
            console.log('more than one admin');
            this.disableMember = false;
            return false;
          }
        }
        if (i === this.organizationMembers.length && this.disableMember) {
          console.log('only one admin');
          this.disableMember = true;
          return true;
        }
      });
    } else {
      return false;
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    const emails = [];
    this.emails.forEach(option => {
      if(option.toLowerCase().includes(filterValue) && !emails.some(el => el === option) && !this.organizationMembers.some(el => el.email === option)) {
        emails.push(option);
      }
    });
    return emails;
  }

  invite() {
    let i = 0;
    this.inOrganizationMembers = [];
    this.members.forEach((member) => {
      this.organizationService
        .checkMemberIsUser(member.name)
        .subscribe((isUser) => {
          i++;
          if (isUser) {
            this.organizationService
              .checkMemberInOrganisation(member.name)
              .subscribe((inOrganization) => {
                if (!inOrganization) {
                  const memberObj = {
                    email: member.name,
                    role: 'member',
                    organisationId: this.organization.id,
                  };
                  this.organizationService
                    .addMemberToOrganization(memberObj)
                    .subscribe((newMember) => {
                      this.organization.totalMembers++;
                      this.store.dispatch(
                        new organizationActions.UpdateOrganization({
                          organization: this.organization,
                          id: this.organization.id,
                        })
                      );
                      const index = this.members.findIndex(
                        (m) => m.name === memberObj.email
                      );
                      this.members.splice(index, 1);
                      this.organizationMembers.push(newMember);
                      // eslint-disable-next-line @typescript-eslint/dot-notation
                      this.sendOrganizationInvitationsToExistedUser(newMember['email']);
                      this.toaster.success(
                        this.translateService.getMessage('toaster.member.added')
                      );
                    });
                } else {
                  if (
                    !this.inOrganizationMembers.some((m) => m === member.name)
                  ) {
                    this.inOrganizationMembers.push(member.name);
                  }
                }
              });
          } else {
            if (!this.notUsers.some((m) => m === member.name)) {
              this.notUsers.push(member.name);
              if (this.members.length === i) {
                this.sendInvitations();
              }
            }
          }
        });
    });
  }

  sendInvitations() {
    const lang = localStorage.getItem('grizzly-lang');
    this.authService.sendInvitation(this.notUsers, lang, this.organization.id, this.organization.name).subscribe();
  }

  sendOrganizationInvitationsToExistedUser(member) {
    const lang = localStorage.getItem('grizzly-lang');
    this.authService.sendOrganizationInvitationToExistedUser(member, lang, this.organization.id, this.organization.name).subscribe();
  }

  deleteMember(id) {
    this.organizationService.getMember(id).subscribe((member: any) => {
      if (member.role === 'admin') {
        this.messageBoxService
          .openInfo('popups.member.deleteAdmin.title', '', {
            info: {
              msg: 'popups.member.deleteAdmin.msg',
            },
          });
      } else {
        // Open the modal to get confirmation for delete
        this.messageBoxService
          .openWarning('popups.member.delete.title', 'popups.member.delete.msg', {
            info: {
              msg: 'messageBox.member.delete',
            },
          })
          .afterClosed()
          .subscribe((data) => {
            if (data) {
              this.organizationService
                .deleteMemberFromOrganization(id)
                .subscribe((d) => {
                  this.organization.totalMembers--;
                  this.store.dispatch(
                    new organizationActions.UpdateOrganization({
                      organization: this.organization,
                      id: this.organization.id,
                    })
                  );
                  const index = this.organizationMembers.findIndex(
                    (m) => m.id === id
                  );
                  this.organizationMembers.splice(index, 1);
                  this.toaster.success(
                    this.translateService.getMessage('toaster.member.deleted')
                  );
                });
            }
          });
      }
    });

  }

  testEmailFormat(email) {
    return true;
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
    this.emailFormatValid = true;

    if ((option || '').trim() && (!this.members.some(member => member.name === option))) {
      this.members.push({ name: option.trim() });
      this.memberInput.nativeElement.value = '';
    } else {
      this.memberInput.nativeElement.value = '';
    }
  }

  changeRole(member, role) {
    if (!this.disableMember || role === 'admin') {
      const index = this.organizationMembers.findIndex((m) => m.id === member.id);
      this.organizationMembers[index].role = role;
      this.teamService.updateMember(member, member.id).subscribe((data) => {
        console.log('update');
        this.onlyOneAdmin();
      });
    }

  }


  remove(member: any): void {
    this.emailFormatValid = true;

    const index = this.members.indexOf(member);
    const userIndex = this.notUsers.findIndex((m) => m === member.name);
    const memberIndex = this.inOrganizationMembers.findIndex(
      (m) => m === member.name
    );
    if (index >= 0) {
      this.members.splice(index, 1);
    }
    if (userIndex >= 0) {
      this.notUsers.splice(userIndex, 1);
    }
    if (memberIndex >= 0) {
      this.inOrganizationMembers.splice(memberIndex, 1);
    }
  }
}
