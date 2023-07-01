import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SwaggerModalComponent } from './swagger-modal.component';
import { Injectable } from '@angular/core';

@Injectable()
export class SwaggerModalService {

    private dialogRef: MatDialogRef<SwaggerModalComponent>;

    constructor(public dialog: MatDialog) { }

    openModal(editor: string) {
        this.dialogRef = this.  dialog.open(SwaggerModalComponent,
            {
                width: '75%',
                height: '80vh',
                position: {
                },
                hasBackdrop: true,
                data: {
                    editor
                }
            });
        return this.dialogRef;
    }


}
