import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { DockerExport } from 'src/app/shared/models/DockerExport';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';

@Component({
  selector: 'app-export-docker-info-modal',
  templateUrl: './export-docker-info-modal.component.html',
  styleUrls: ['./export-docker-info-modal.component.sass']
})
export class ExportDockerInfoModalComponent implements OnInit {

  @ViewChild('dockerPull', { static: false }) dockerPull: ElementRef;
  @ViewChild('dockerRun', { static: false }) dockerRun: ElementRef;
  @ViewChild('dockerCompose', { static: false }) dockerCompose: ElementRef;

  constructor(private translateService: AppTranslateService, private toaster: ToastrService, public dialogRef: MatDialogRef<ExportDockerInfoModalComponent>,  private confirmModalService: ConfirmModalService, @Inject(MAT_DIALOG_DATA) public data: any) { }
  baseUrl = '';
  dockerComposeString = '';
  docker = new DockerExport();
  ngOnInit() {
    this.docker = this.data.docker;
    this.dockerComposeString = this.data.dockerCompose;
    this.baseUrl = window.location.origin;
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
