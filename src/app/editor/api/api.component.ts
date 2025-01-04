import { Component, OnInit, ViewChild, Input, ViewChildren, Output, EventEmitter } from '@angular/core';
import { Resource } from 'src/app/shared/models/Resource';
import { MatTable } from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ResourceGroup } from 'src/app/shared/models/ResourceGroup';
import { ToastrService } from 'ngx-toastr';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { Container } from 'src/app/shared/models/Container';
import { ResourceModalComponent } from 'src/app/resource/resource-modal/resource-modal.component';
import { Store } from '@ngrx/store';
import { ContainerState } from 'src/app/store/container/container.state';
import * as containerActions from '../../store/container/container.actions';
import { CdkDragDrop, moveItemInArray, copyArrayItem } from '@angular/cdk/drag-drop';
import SwaggerUI from 'swagger-ui';
import { FunctionService } from 'src/app/function/function.service';
import { FetchFunctionsRequest } from 'src/app/shared/models/FetchFunctionsRequest';

@Component({
  selector: 'app-api-editor',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit {
  @ViewChild('table', { static: false }) table: MatTable<Resource>;
  @Input() group: ResourceGroup;
  @Input() container: Container;
  @Input() refreshSwagger;
  @Input() ui;
  @Input() el;
  @Input() swaggerBaseUrl;
  @ViewChildren('myCheckBoxs') checkBoxs: MatCheckbox[];
  resourcesToDelete = [];
  @Output() resourcesSelected: EventEmitter<any> = new EventEmitter<any>();


  displayedColumns = ['Check', 'Method', 'Path', 'Summary', 'Codes', 'Actions'];
  constructor(private functionService: FunctionService,private toaster: ToastrService, private translateService: AppTranslateService, private containersStore: Store<ContainerState>, private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  getParams(resource) {
    const index = resource.parameters.findIndex(el=>el.in.toLowerCase()==='body'&&el.modelName!==null&&el.modelName!=='');
    let paramTooltip='';
    if (index>=0) {
      paramTooltip+='Request : '+ resource.parameters[index].modelName+'\n';
    }
    const responseIndex = resource.responses.findIndex(el=>el.code>199 && el.code<300 && el.schema!==null);
    if (responseIndex>=0) {
      if (resource.responses[responseIndex].schema.ref!==null &&resource.responses[responseIndex].schema.ref!=='') {
        paramTooltip+='Response : '+ resource.responses[responseIndex].schema.ref+'\n';
      }
    }
    if(resource.parameters.filter(el=>el.in.toLowerCase()!=='body').length > 0) {
      paramTooltip += 'Request Params : {\n';
      resource.parameters.filter(el=>el.in.toLowerCase()!=='body').forEach(el => {
        paramTooltip += '  ' + el.name + ' : ' + el.type + '\n';
      });
      paramTooltip += '}\n';
    }
    return paramTooltip;
  }

  getCodes(responses) {

    const obj = { success: [], fail: [] };
    responses.map(el => el.code).forEach(element => {
      if (element > 199 && element < 300) {
        obj.success.push(element);
      } else {
        obj.fail.push(element);
      }
    });
    return obj;
  }
  public openResourceEditModal(resourceEdit: Resource): void {
    const doc = document.documentElement;
    const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    if (top !== 0 || left !== 0) {
      window.scrollTo({ top : 0, left: 0 });
}
    const dialogRef = this.dialog.open(ResourceModalComponent,
      {
        position: {
          top: '10px',
          right: '10px'
        },
        height: '98%',
        width: '100vw',
        panelClass: 'full-screen-modal',
        data: {
          resource: resourceEdit,
          ressourceIndex: this.group.resources.findIndex((x: Resource) => x.path.toUpperCase() === resourceEdit.path.toUpperCase() && x.httpMethod === resourceEdit.httpMethod),
          Rgroup: this.group,
          container: this.container,
          editMode: true,
          editorMode: true,
          action: {
            msg: 'popups.resource.edit'
          }
        }});

    dialogRef.afterClosed().subscribe(res => {
      if (top !== 0 || left !== 0) {
        window.scroll({ top, left, behavior: 'smooth' });
    }
      if (this.swaggerBaseUrl.substr(this.swaggerBaseUrl.lastIndexOf('/') + 1) !== 'null') {
        this.ui = SwaggerUI({
          url: this.swaggerBaseUrl,
          domNode: this.el.nativeElement.querySelector('.swagger-container'),
          deepLinking: true,
          presets: [
            SwaggerUI.presets.apis
          ],
        });
        // Back to Top
        window.scrollTo({ top: 0 });
      }
    });
  }

  public getGroupIndex(group: ResourceGroup): number {
    return this.container.resourceGroups.findIndex((x: ResourceGroup) => x.name.toUpperCase() === group.name.toUpperCase());
  }

  public getResourceIndex(resourceSearchIndex: Resource, groupIndex): number {
    return this.container.resourceGroups[groupIndex].resources.findIndex((x: Resource) => x.name.toUpperCase() === resourceSearchIndex.name.toUpperCase());
  }

  public checkResource(resourceCheck: Resource, group: ResourceGroup): void {

    const index = this.resourcesToDelete.findIndex((x) => (x.resources.httpMethod + x.resources.path) === (resourceCheck.httpMethod + resourceCheck.path));
    const id = group.name + '#' + resourceCheck.path + '#' + resourceCheck.httpMethod;
    this.checkBoxs.forEach(x => {
      if (x.id === id) {
        if (index >= 0 && x.checked) {
          this.resourcesToDelete.splice(index, 1);
        } else {
          this.resourcesToDelete.push({ group, resources: resourceCheck });
        }
        this.resourcesSelected.emit(this.resourcesToDelete);
      }
    });

  }
}
