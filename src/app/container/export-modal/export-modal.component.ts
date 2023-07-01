import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContainerService } from '../container.service';
import * as fileSaver from 'file-saver';
const yaml = require('js-yaml');

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.scss']
})
export class ExportModalComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialogRef<ExportModalComponent>, private containerService: ContainerService
  ) { }

  ngOnInit(): void {
  }

    /** Generate and Download the corresponding Swagger.json File for the Given Container Id & Name */
    downloadGeneratedSwagger(mode) {
      this.containerService.getGeneratedSwagger(this.data.containerId, mode).subscribe(response => {
        this.saveFile(response.body, response.headers.get('fileName'));
      });
    }
    downloadGeneratedOpenApi(mode) {
      this.containerService.getGeneratedOpenApi(this.data.containerId, mode).subscribe(response => {
      const responseBody = JSON.stringify(yaml.load(response.body));
        this.saveFile(responseBody, response.headers.get('fileName'));
      });
    }

      /** Save the Generated Json File */
  saveFile(data: any, filename?: string) {
    const blob = new Blob([data], { type: 'text/csv; charset=utf-8' });
    fileSaver.saveAs(blob, filename);
  }

}
