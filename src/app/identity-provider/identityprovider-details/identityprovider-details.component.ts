import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SlideInOutAnimation } from 'src/app/shared/animations';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { MessageService } from 'src/app/shared/message-modal/message.service';
import { IdentityProvider } from 'src/app/shared/models/IdentityProvider';
import { Keycloak } from 'src/app/shared/models/Keycloak';
import { IdentityProviderState } from 'src/app/store/identityprovider/identityprovider.state';
import { IdentityProviderModalService } from '../identityprovider-modal/identityprovider-modal.service';
import { IdentityProviderService } from '../identityprovider.service';
import * as identityproviderActions from '../../store/identityprovider/identityprovider.actions';
import { Project } from 'src/app/shared/models/Project';

@Component({
  selector: 'app-identityprovider-details',
  templateUrl: './identityprovider-details.component.html',
  styleUrls: ['./identityprovider-details.component.scss'],
  animations: [SlideInOutAnimation]
})
export class IdentityproviderDetailsComponent implements OnInit {

  toggleIdentityProviderDetails = false;
  identityproviderList: IdentityProvider[];
  identityprovider: IdentityProvider;
  projectList: Project[];
  showKeycloakInformations = false;
  constructor(private confirmModalService: ConfirmModalService,private activateRoute: ActivatedRoute,private router: Router,
    private store: Store<IdentityProviderState>,private identityproviderService: IdentityProviderService,
    private messageBoxService: MessageService,private identityproviderModalService: IdentityProviderModalService) { }

  ngOnInit(): void {
      this.store.select('identityproviders').subscribe(r => {
        this.activateRoute.params.subscribe(param => {
          this.identityproviderService.getIdentityProviderById(param.id).subscribe((res : any) => {
            this.identityprovider = res;
            if(this.identityprovider.name === 'KEYCLOAK') {
              this.showKeycloakInformations = true;
            } else {
            this.showKeycloakInformations = false;
             }
          })
        });
      });

      this.store.select<any>('projects').subscribe(resState => {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.projectList = resState['projects'];
      })
  }

  public openConfirmDeleteDialog() {
    const authMSLinkedToThisIdentityProvider = this.projectList.filter(p => p.identityProviderIds).filter(p1 => p1.identityProviderIds.includes(this.identityprovider.id));
    const index = this.projectList.filter(p => p.authMSRuntimeURL !== null).findIndex(p => p.authMSRuntimeURL);
    let isMSToThisIdentityProvider = false;
    if(index !== -1) {
      isMSToThisIdentityProvider = this.projectList[index].identityProviderIds.includes(this.identityprovider.id);
    }
    if(isMSToThisIdentityProvider === true || authMSLinkedToThisIdentityProvider.length !== 0) {
      this.messageBoxService.openError('popups.identityprovider.delete.title', 'popups.identityprovider.noDelete',
        {
          identityproviderName: this.identityprovider.name,
        });
    } else {
      this.messageBoxService.openWarning('popups.identityprovider.delete.title', 'popups.identityprovider.delete.msg',
        {
          identityproviderName: this.identityprovider.name,
          info: {
            msg: 'messageBox.identityprovider.delete',
            infos: ['messageBox.identityprovider.msgDeleteAllcontent', 'messageBox.identityprovider.msgNoBackup']
          }
        })
        .afterClosed().subscribe((data) => {
          if (data) {
            this.store.dispatch(new identityproviderActions.DeleteIdentityProvider(this.identityprovider.id));
            this.router.navigate(['/app/dashboard']);
          }
        });
    }
  }
  openEditIdentityProviderModal() {
    this.identityproviderModalService.openupdate(this.identityprovider);
  }

  showIdentityProviderDetails() {
    this.toggleIdentityProviderDetails = !this.toggleIdentityProviderDetails;
  }

}
