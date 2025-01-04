import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { OrganisationModalComponent } from './organisation-modal.component';


@Injectable({
    providedIn: 'root'
})
export class OrganizationModalService {

    public dialogRef: MatDialogRef<OrganisationModalComponent>;

    constructor(public dialog: MatDialog) { }
    public close() {
        this.dialog.closeAll();
    }
}
