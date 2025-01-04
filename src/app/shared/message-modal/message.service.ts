import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageModalComponent } from './message-modal.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private dialogRef: MatDialogRef<MessageModalComponent>;

  constructor(public dialog: MatDialog) { }

  openError(titleKey: string, msgKey: string = '', params: {}, subtitle?: string) {
    return this.openConfirm(titleKey, msgKey, params, 0, subtitle);
  }

  openWarning(titleKey: string, msgKey: string = '', params: {},withCancel?:boolean, subtitle?: string ) {
    return this.openConfirm(titleKey, msgKey, params, 1, subtitle , withCancel);
  }

  openWarningWithArray(titleKey: string, msgKey: string = '' , array: any[] , params: {}, subtitle?: string) {
    return this.openConfirmWithArray(titleKey,   msgKey, array, params, 1, subtitle);
  }



  openInfoLimitReached(titleKey: string, msgKey: string = '', params: {}, subtitle?: string ) {
    return this.openConfirm(titleKey, msgKey, params, 2, subtitle , true , true);
  }
  openInfo(titleKey: string, msgKey: string = '', params: {}, subtitle?: string , upgradeAccount?:any) {
    return this.openConfirm(titleKey, msgKey, params, 2, subtitle , false , false, upgradeAccount);
  }

  openConfirm(titleKey: string, msgKey: string = '', params: {}, mode: number, subtitle?: string , withCancel?:boolean , withUpgrade?:boolean  , upgradeAccount?:any) {
    this.dialogRef = this.dialog.open(MessageModalComponent,
      {
        width: '50%',
        position: {
          top: '200px',
        },
        hasBackdrop: true,
        data: {
          title: titleKey,
          subtitle,
          message: msgKey,
          params,
          mode,
          withCancel,
          withUpgrade,
          upgradeAccount
        },
        panelClass: 'custom-dialog-container'
      });
    return this.dialogRef;
  }
  openConfirmWithArray(titleKey: string, msgKey: string = '',  array: any[] , params: {}, mode: number, subtitle?: string ) {
    this.dialogRef = this.dialog.open(MessageModalComponent,
      {
        width: '50%',
        position: {
          top: '200px',
        },
        hasBackdrop: true,
        data: {
          title: titleKey,
          subtitle,
          message: msgKey,
          params,
          mode,
          array
        },
        panelClass: 'custom-dialog-container'
      });
    return this.dialogRef;
  }
}

// How to Use IT
// this.messageModalService.openWarning('title', 'message', {}).afterClosed().subscribe(() => console.log('rr'));
// private messageModalService: MessageService
