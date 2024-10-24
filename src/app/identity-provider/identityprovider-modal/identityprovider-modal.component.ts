import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {ToastrService} from 'ngx-toastr';
import {IdentityProvider} from 'src/app/shared/models/IdentityProvider';
import {AppTranslateService} from 'src/app/shared/services/app-translate-service';
import {IdentityProviderState} from 'src/app/store/identityprovider/identityprovider.state';
import * as identityproviderActions from '../../store/identityprovider/identityprovider.actions';
import {IdentityProviderService} from '../identityprovider.service';

@Component({
  selector: 'app-identityprovider-modal',
  templateUrl: './identityprovider-modal.component.html',
  styleUrls: ['./identityprovider-modal.component.scss'],
})
export class IdentityproviderModalComponent implements OnInit {
  isFr: boolean;
  selectedLanguage: string;
  testConnectionClicked = false;
  showMessages = false;
  showSecretKey = true;
  identityprovider = new IdentityProvider();
  test = false;
  unicity = false;

  opencredswizard = false;

  constructor(
    private identityProviderService: IdentityProviderService,
    public dialogRef: MatDialogRef<IdentityproviderModalComponent>,
    private store: Store<IdentityProviderState>,
    private appTranslateService: AppTranslateService,
    private toasterService: ToastrService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    if (this.data.identityprovider) {
      this.identityprovider = Object.assign({}, this.data.identityprovider);
    }
    if (this.identityprovider.name === 'KEYCLOAK') {
      if (this.data.mode === 1 && this.identityprovider.credentials.accessType === 'public') {
        this.showSecretKey = false;
      }
      this.opencredswizard = true;
    } else {
      this.showSecretKey = false;
    }

  }

  createNewIdentityProvider() {
    this.identityprovider.userEmail = localStorage.getItem('userEmail');
    this.identityProviderService.checkUnicity(this.identityprovider.displayedName, this.identityprovider.userEmail, this.identityprovider.id).subscribe(res => {
      if (this.identityprovider.displayedName && res) {
        if (!this.data.identityprovider) {
          this.store.dispatch(new identityproviderActions.AddIdentityProvider(this.identityprovider));
        } else {
          this.store.dispatch(new identityproviderActions.UpdateIdentityProvider(this.identityprovider));
        }
        this.dialogRef.close();
      } else {
        this.toasterService.error(this.appTranslateService.getMessage('toaster.identityprovider.name'));
      }
    });
  }
  onClick() {
    if (this.identityprovider.name === 'KEYCLOAK') {
      this.opencredswizard = true;
    } else {
      this.opencredswizard = false;
    }
  }

  isStepCompleted(index) {
    if (index === 0) {
      if (this.identityprovider.name) {
        return true;
      } else {
        return false;
      }
    }
    if (index === 1) {
      if (this.identityprovider.displayedName) {
        if (this.identityprovider.name === 'KEYCLOAK') {
          if (this.identityprovider.credentials.clientId &&
            this.identityprovider.credentials.grantType &&
            this.identityprovider.credentials.issuer &&
            this.identityprovider.credentials.accessType &&
            this.identityprovider.credentials.userName &&
            this.identityprovider.credentials.password) {
            if (this.identityprovider.credentials.accessType === 'confidential') {
              if (!this.identityprovider.credentials.secretKey) {
                return false;
              }
            }
            if (this.testConnectionClicked && this.identityprovider.connectionSucceeded === true) {
              return true;
            }
          }
          return false;
        }
        return true;
      }
      return false;
    }
  }

  checkIfCredentialsIsSelected() {
    if (this.identityprovider.credentials.accessType === 'confidential') {
      this.showSecretKey = true;
    } else {
      this.showSecretKey = false;
      this.identityprovider.credentials.secretKey = null;
    }
  }

  checkUnicity() {
    this.identityProviderService.checkUnicity(this.identityprovider.name, this.identityprovider.userEmail, this.identityprovider.id).subscribe(res => {
      if (res) {
        this.unicity = true;
      } else {
        this.unicity = false;
      }
    });
  }

  onCheckConnection() {
    this.testConnectionClicked = true;
    this.identityProviderService.checkIdentityProviderConnection(
      this.identityprovider.credentials.clientId,
      this.identityprovider.credentials.secretKey,
      this.identityprovider.credentials.grantType,
      this.identityprovider.credentials.issuer,
      this.identityprovider.credentials.accessType,
      this.identityprovider.credentials.userName,
      this.identityprovider.credentials.password
    ).subscribe((res) => {
      if (res === 'true') {
        this.identityprovider.connectionSucceeded = true;
      } else {
        this.identityprovider.connectionSucceeded = false;
      }

    });
  }
}
