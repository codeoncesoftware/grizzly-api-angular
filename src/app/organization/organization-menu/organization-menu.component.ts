import { Component, OnInit } from '@angular/core';
import { OrganisationModalComponent } from '../organisation-modal/organisation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/store/authentication/auth.state';
import { MessageService } from 'src/app/shared/message-modal/message.service';

@Component({
  selector: 'app-organization-menu',
  templateUrl: './organization-menu.component.html',
  styleUrls: ['./organization-menu.component.scss']
})
export class OrganizationMenuComponent implements OnInit {



  constructor(public dialog: MatDialog,
              private store: Store<AuthState>,
              private messageBoxService: MessageService ) { }

  organizationShow = false;
  organizationName = '';
  organizationId: string;
  userOrganization: any = {};
  organizationNameAbrev: string;
  user: any;
  menuShow = false;
  showAccordion = false;
  ngOnInit(): void {
    const userAccessor = 'user';
    this.store.select<any>('auth').subscribe((userState) => {
      this.menuShow = userState[userAccessor].isAdmin;
      this.user = userState[userAccessor];
      if (userState[userAccessor].organisationName) {
        this.organizationShow = true;
        this.organizationName = userState[userAccessor].organisationName;
        this.organizationId = userState[userAccessor].organisationId;
        this.organizationNameAbrev = this.organizationName
          .substr(0, 2)
          .toUpperCase();
      } else {
        this.organizationShow = false;
      }
    });

  }
  showAcc(){
    this.showAccordion = !this.showAccordion
  }

  // Open the modal with the create organization form
  openDialog(): void {
      this.dialog.open(OrganisationModalComponent, {
        // Modal configuration
        width: '800px',
        height: '85vh',
        position: {
          top: '9vh',
        },
        data: {
          action: {
            update: false,
            create: true,
            msg: 'popups.organization.add',
          },
        },
      });
  }
}


