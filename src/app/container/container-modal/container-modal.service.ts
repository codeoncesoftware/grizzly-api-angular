import { MatDialog } from '@angular/material/dialog';
import { ContainerModalComponent } from './container-modal.component';
import { Injectable } from '@angular/core';


@Injectable()
export class ContainerModalService {

    constructor(public dialog: MatDialog) { }

    openContainerModal(params) {
        return this.dialog.open(ContainerModalComponent,
            {
                width: '50%',
                position: {
                  top: '15vh'
                },
                data: params
                ,
                hasBackdrop: true
            });

    }
}
