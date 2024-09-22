import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Container } from 'src/app/shared/models/Container';
import { ContainerService } from '../container.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-export-models',
  templateUrl: './export-models.component.html',
  styleUrls: ['./export-models.component.scss']
})
export class ExportModelsComponent implements OnInit {
  container: Container;
  swaggerModelsToDownload = [];
  typescriptModels = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public dialogRef: MatDialogRef<ExportModelsComponent>) { }

  ngOnInit(): void {
    this.container = this.data.container;
  }

  addToDownload(model) {
    const index = this.swaggerModelsToDownload.findIndex(el => el.title === model.title);
    (index < 0) ? this.swaggerModelsToDownload.push(model) : this.swaggerModelsToDownload.splice(index, 1);
  }
  parseSwaggerModelToTypescript(model) {
    let typescriptClass = 'class ';
    typescriptClass = typescriptClass + model.title + ' { \n';
    model.properties.forEach(prop => {
      const type = ['integer', 'number'].includes(prop.type) ? 'number' : prop.type;
      if (prop.array) {
        typescriptClass += ('\t' + prop.name + ': ' + type + '[]' + '; \n');
      } else {
        typescriptClass += ('\t' + prop.name + ': ' + type + '; \n');
      }
    });
    typescriptClass = typescriptClass + '}';
    this.typescriptModels.push({ className: model.title, typescriptClass });
  }
  downloadSTsFiles() {
    this.swaggerModelsToDownload.forEach(swaggerModel => {
      this.parseSwaggerModelToTypescript(swaggerModel);
    });
    this.typescriptModels.forEach(tsModel => {
      const blob = new Blob([tsModel.typescriptClass], { type: 'text/csv; charset=utf-8' });
      fileSaver.saveAs(blob, tsModel.className + '.ts');
    });

  }

}
