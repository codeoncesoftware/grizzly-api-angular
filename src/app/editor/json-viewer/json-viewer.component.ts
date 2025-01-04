import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ContainerService } from 'src/app/container/container.service';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
const YAML = require('json-to-pretty-yaml');

@Component({
  selector: 'app-json-viewer',
  templateUrl: './json-viewer.component.html',
  styleUrls: ['./json-viewer.component.scss']
})
export class JsonViewerComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<JsonViewerComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private containerService: ContainerService,
              private toaster: ToastrService, private translateService: AppTranslateService) { }

  content = {};
  tab = 0;
  swaggerContent = {};
  openApiContent = {};

  ngOnInit() {
    this.swaggerContent = JSON.parse(this.data.swaggerContent);
    this.openApiContent = JSON.parse(this.data.openApiContent);
  }

  copyJson() {
    if (this.tab === 0) {
      this.copy(JSON.stringify(this.swaggerContent));
    } else {
      this.copy(JSON.stringify(this.openApiContent));
    }
  }

  copyYaml() {
    if (this.tab === 0) {
      this.copy(YAML.stringify(this.swaggerContent));
    } else {
      this.copy(YAML.stringify(this.openApiContent));
    }
  }


  /**
   * Copy the passed value to to clipboard'
   * @param json to copy
   */
  copy(json) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = json;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toaster.success(this.translateService.getMessage('toaster.resource.copy'));
  }

  changeTab(e) {
    this.tab = e.index;
  }

}
