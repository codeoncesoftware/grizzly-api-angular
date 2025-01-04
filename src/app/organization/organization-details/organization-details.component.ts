import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/shared/message-modal/message.service';
import { OrganizationsState } from 'src/app/store/organization/organization.state';
import { Store } from '@ngrx/store';
import * as organizationActions from '../../store/organization/organization.actions';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.scss']
})
export class OrganizationDetailsComponent implements OnInit {

  organization: any = {};
  organizationNameAbrev: string;
  emailFormatValid = true;
  constructor(private messageBoxService: MessageService,
              private store: Store<OrganizationsState>) { }
  ngOnInit(): void {
    this.store.dispatch(new organizationActions.LoadAllOrganizations([{}]));
    const accessor = 'organization';
    this.store.select(accessor).subscribe(state => {
      if (state[accessor].length !== 0) {
        this.organization = state[accessor][0];
        this.organizationNameAbrev = (this.organization.name).substr(0, 2).toUpperCase();
      }
    });
  }
  updateOrganization() {
    this.emailFormatValid = true;
    const emailRegExp = new RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}');
    if (!emailRegExp.test(this.organization.email.trim())) {
      this.emailFormatValid = false;
    } else {

      this.store.dispatch(new organizationActions.UpdateOrganization({ organization: this.organization, id: this.organization.id }));
    }
  }
  // Open the modal to get confirmation for delete
  public openConfirmDeleteDialog() {
    this.messageBoxService.openWarning('popups.organization.delete.title', 'popups.organization.delete.msg',
      {
        name: this.organization.name,
        info: {
          msg: 'messageBox.organization.delete',

        }
      }).afterClosed().subscribe((data) => {
        if (data) {
          this.store.dispatch(new organizationActions.DeleteOrganization(this.organization.id));
        }
      });

  }


}
