import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DbsourceModalComponent } from './dbsource-modal.component';
import { DBSource } from 'src/app/shared/models/DBSource';
import { CsvuploadComponent } from '../dbsource-details/csvupload/csvupload.component';

@Injectable({
    providedIn: 'root'
})

export class DbSourceModalService {

    private dialogRef: MatDialogRef<DbsourceModalComponent>;
    private dialogUploadRef: MatDialogRef<CsvuploadComponent>;

    constructor(public dialog: MatDialog) { }

    openAdd(dbSource: DBSource) {
        return this.openModal(dbSource, 0);
    }

    openupdate(dbSource: DBSource) {
        return this.openModal(dbSource, 1);
    }

    openUpload(dbSource: DBSource) {
        return this.openUploadModal(dbSource);
    }

    openModal(dbsource: DBSource, mode: number) {
        this.dialogRef = this.dialog.open(DbsourceModalComponent,
            {
                width: '75%',
                height: '80vh',
                hasBackdrop: true,
                disableClose: true,
                data: {
                    dbsource,
                    mode
                }
            });
        return this.dialogRef;
    }
    openUploadModal(dbsource: DBSource) {
        this.dialogUploadRef = this.dialog.open(CsvuploadComponent,
            {
                width: '55%',
                height: '30vh',
                hasBackdrop: true,
                disableClose: true,
                data: {
                    dbsource
                }
            });
        return this.dialogUploadRef;
    }
}
