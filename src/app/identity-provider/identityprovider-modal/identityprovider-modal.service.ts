import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IdentityProvider } from 'src/app/shared/models/IdentityProvider';
import { IdentityproviderModalComponent } from './identityprovider-modal.component';

@Injectable({
    providedIn: 'root'
})

export class IdentityProviderModalService {

    private dialogRef: MatDialogRef<IdentityproviderModalComponent>;

    constructor(public dialog: MatDialog) { }

    openAdd(identityprovider: IdentityProvider) {
        return this.openModal(identityprovider, 0);
    }

    openupdate(identityprovider: IdentityProvider) {
        return this.openModal(identityprovider, 1);
    }

    openModal(identityprovider: IdentityProvider, mode: number) {
        this.dialogRef = this.dialog.open(IdentityproviderModalComponent,
            {
                width: '75%',
                height: '90vh',
                hasBackdrop: true,
                disableClose: true,
                data: {
                    identityprovider,
                    mode
                }
            });
        return this.dialogRef;
    }
}
