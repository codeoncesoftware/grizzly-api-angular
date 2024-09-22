import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Organization } from 'src/app/shared/models/Organization';
import { OrganizationsState } from 'src/app/store/organization/organization.state';
import { Store } from '@ngrx/store';
import * as organizationActions from '../../store/organization/organization.actions';
import { OrganizationService } from '../organization-menu/organization.service';

@Component({
  selector: 'app-organisation-modal',
  templateUrl: './organisation-modal.component.html',
})
export class OrganisationModalComponent implements OnInit {

  organization = new Organization();
  nameUnicityError = false;
  emailFormatValid = true;
  constructor(
    private organizationService: OrganizationService,
    public store: Store<OrganizationsState>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OrganisationModalComponent>,
    public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  resetNameUnicity() {
    this.nameUnicityError = false;
  }
  Save() {
    if (this.data.action.create) {
      if (this.organization.name) {
        const emailRegExp = new RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}');
        if (!emailRegExp.test(this.organization.email.trim())) {
          this.emailFormatValid = false;
        } else {
          this.organizationService.checkOrganisationUnicity(this.organization.name).subscribe(result => {
            if (!result) {
              this.store.dispatch(new organizationActions.AddOrganization(this.organization));
            } else {
              this.nameUnicityError = true;
            }
          });
        }
      }
    }
  }
}
