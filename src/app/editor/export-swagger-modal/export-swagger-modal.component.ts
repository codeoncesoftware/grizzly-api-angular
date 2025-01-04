import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ContainerService } from 'src/app/container/container.service';
import * as fileSaver from 'file-saver';
const YAML = require('json-to-pretty-yaml');
const yaml = require('js-yaml');

@Component({
  selector: 'app-export-swagger-modal',
  templateUrl: './export-swagger-modal.component.html',
  styleUrls: ['./export-swagger-modal.component.sass']
})
export class ExportSwaggerModalComponent implements OnInit {
  choice: any;
  format: any;
  project: any = {};
  container: any = {};

  constructor(
    public dialogRef: MatDialogRef<ExportSwaggerModalComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private containerService: ContainerService,
  ) {

  }

  ngOnInit(): void {
    this.project = this.data.project;
    this.container = this.data.container;
    this.choice = 'swagger';
    this.format = 'json';
  }

  save() {
    if (this.choice === 'swagger') {
      if (this.format === 'json') {
        this.downloadJsonSwagger();
      }
      if (this.format === 'yaml') {
        this.downloadYamlSwagger();
      }
    }
    if (this.choice === 'OpenApi') {
      if (this.format === 'json') {
        this.downloadJsonOpenApi();
      }
      if (this.format === 'yaml') {
        this.downloadYamlOpenApi();
      }
    }
    this.dialogRef.close();
  }

  downloadJsonSwagger() {
    this.containerService.getGeneratedSwagger(this.container.id, 'prod').subscribe(response => {
      this.saveFile(response.body, response.headers.get('fileName'));
    });
  }

  downloadYamlSwagger() {
    this.containerService.getGeneratedSwagger(this.container.id, 'prod').subscribe(response => {
      this.saveFile(YAML.stringify(JSON.parse(response.body)), this.project.name + '_' + this.container.name + '.yaml');
    });
  }

  downloadJsonOpenApi() {
    this.containerService.getGeneratedOpenApi(this.container.id, 'prod').subscribe(response => {
      const responseBody = JSON.stringify(yaml.load(response.body));
      this.saveFile(responseBody, response.headers.get('fileName'));
    });
  }

  downloadYamlOpenApi() {
    this.containerService.getGeneratedOpenApi(this.container.id, 'prod').subscribe(response => {
      const responseBody = JSON.stringify(yaml.load(response.body));
      this.saveFile(YAML.stringify(JSON.parse(responseBody)), this.project.name + '_' + this.container.name + '.yaml');
    });
  }
  /** Save the Generated Json File */
  saveFile(data: any, filename?: string) {
    const blob = new Blob([data], { type: 'text/yaml; charset=utf-8' });
    fileSaver.saveAs(blob, filename);
  }

}
