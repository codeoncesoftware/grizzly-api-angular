import { DashboardService } from 'src/app/layout/dashboard/dashboard.service';
import { IdentityProvider } from 'src/app/shared/models/IdentityProvider';
import { IdentityProviderModalService } from '../identityprovider-modal/identityprovider-modal.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/shared/message-modal/message.service';
import { IdentityProviderState } from 'src/app/store/identityprovider/identityprovider.state';
import { Store } from '@ngrx/store';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons/faShieldAlt';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';

@Component({
  selector: 'app-identityprovider-list',
  templateUrl: './identityprovider-list.component.html',
  styleUrls: ['./identityprovider-list.component.scss'],
})
export class IdentityproviderListComponent implements OnInit {
  identityproviderList: IdentityProvider[] = [];
  fetching = false;
  dots = '.';
  faShieldAlt= faShieldAlt;
  faCircle=faCircle;
  constructor(
    public dialog: MatDialog,
    private identityproviderModalService: IdentityProviderModalService,
    private store: Store<IdentityProviderState>,
    private dashboardService: DashboardService,
    private messageBoxService: MessageService
  ) {}

  ngOnInit() {
    if(localStorage.getItem('userEmail') !== null) {
      this.store.select('identityproviders').subscribe((res) => {
        // eslint-disable-next-line @typescript-eslint/dot-notation
      this.identityproviderList = Array.from(new Set(res['identityproviders']));
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.fetching = res['loading'];
      if (this.fetching === true) {
        this.displayFetchingDots();
      }
    });
    }
  }

  public openIdentityProviderModal() {
      this.identityproviderModalService.openAdd(null);
  }

  public displayFetchingDots() {
    if (this.dots.length > 4) {
      this.dots = '.';
    } else {
      this.dots = this.dots + '.';
    }
  //  setTimeout(() => this.displayFetchingDots(), 1000);

    return this.dots;
  }
}
