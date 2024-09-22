import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { ProjectsState } from 'src/app/store/project/project.state';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';

@Component({
  selector: 'app-resource-details-modal',
  templateUrl: './resource-details-modal.component.html',
  styleUrls: ['./resource-details-modal.component.scss']
})
export class ResourceDetailsModalComponent implements OnInit {
  baseUrl: string;
  containerId: string;

  @ViewChild('curl', { static: false }) curl: ElementRef;
  @ViewChild('angular', { static: false }) angular: ElementRef;

  constructor(private translateService: AppTranslateService, private store: Store<ProjectsState>, private toaster: ToastrService, public dialogRef: MatDialogRef<ResourceDetailsModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.baseUrl = window.location.origin;
    this.store.select<any>('containers').subscribe(resState => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.containerId = resState['active'].id;
    });
  }

  copyText(element) {
    const text = element.innerHTML.trim();
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toaster.success(this.translateService.getMessage('toaster.resource.copy'));
  }
}
