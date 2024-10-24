import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExecuteModalComponent } from './execute-modal.component';
import { Injectable } from '@angular/core';

@Injectable()
export class ExecuteModalService {

  private dialogRef: MatDialogRef<ExecuteModalComponent>;

  constructor(public dialog: MatDialog) { }

  openExecuteModal(content) {
    this.dialogRef = this.dialog.open(ExecuteModalComponent,
      {
        width: '90vw',
        height: '90vh',
        position: {

        },
        hasBackdrop: true,
        data: {
          content
        }
      });
    return this.dialogRef;
  }
}
