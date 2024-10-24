import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewChildren } from '@angular/core';
import { ResourceService } from '../resource.service';
import { Resource } from 'src/app/shared/models/Resource';
import { ChangeDetectorRef } from '@angular/core';

import { ResourceGroup } from 'src/app/shared/models/ResourceGroup';
import { ResourceDetailsModalComponent } from '../resource-details-modal/resource-details-modal.component';
import { ResourceModalComponent } from '../resource-modal/resource-modal.component';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { Container } from 'src/app/shared/models/Container';

import { Store } from '@ngrx/store';
import { ContainerState } from 'src/app/store/container/container.state';
import * as containerActions from '../../store/container/container.actions';
import { Observable } from 'rxjs';
import { FileElement } from 'src/app/shared/models/FileElement';
// import { FileService } from '../file-explorer/service/file.service';
import { FileUploader } from 'ng2-file-upload';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTable } from '@angular/material/table';
import { DBSourcesState } from 'src/app/store/dbsource/dbsource.state';
import { DBSource } from 'src/app/shared/models/DBSource';
import { ToastrService } from 'ngx-toastr';
import { ExecuteModalService } from '../execute-modal/execute-modal.service';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { ResourceInvalidModalComponent } from './resource-invalid-modal/resource-invalid-modal.component';
import { FetchFunctionsRequest } from 'src/app/shared/models/FetchFunctionsRequest';
import { FunctionService } from 'src/app/function/function.service';
import { ResourceFunctionModalComponent } from '../resource-function-modal/resource-function-modal.component';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})

export class ResourceListComponent implements OnInit {

  @ViewChild('table', { static: false }) table: MatTable<Resource>;
  /** FILE EXPLORER VARIABLEs */
  public fileElements: Observable<FileElement[]>;
  currentRoot: FileElement;
  executionErrorMessage: number;
  @ViewChildren('myCheckBoxs') checkBoxs: MatCheckbox[];
  /** NG2 UPLOADER */
  public uploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver = false;
  /** Input Params from the Parent Component */
  @Input() group: ResourceGroup;
  @Input() container: Container;
  /** Resources List to display */
  resources: Resource[] = [];
  /** MatTable Params */
  displayedColumns = ['check', 'Method', 'File Uri', 'Summary','Functions', 'Roles', 'Actions'];

  resourcesToDelete = [];
  secondaryFilePaths: any[] = [];

  // DBSources List
  dbSources: DBSource[] = [];
  /** Emitter to inform the Parent component about the slected Resource */
  @Output() resourcesSelected: EventEmitter<any> = new EventEmitter<any>();
  constructor(private containersStore: Store<ContainerState>,
    /* eslint-disable @typescript-eslint/indent */
    private dbSourcesStore: Store<DBSourcesState>,
    private toaster: ToastrService,
    private dialog: MatDialog,
    private resourceService: ResourceService,
    private store: Store<ContainerState>,
    public executeModalService: ExecuteModalService,
    private translateService: AppTranslateService
  ) { }
  /* eslint-enable @typescript-eslint/indent */
  ngOnInit() {
    this.group.resources.forEach(resource => {
      if (resource.missingAttributes.length !== 0) {
        resource.valid = 'Invalid';
      } else { resource.valid = 'Valid'; }
    });
    this.store.select('containers').subscribe(resState => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.container = resState['active'];
     
    });
    this.dbSourcesStore.select('dbsources').subscribe(res => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.dbSources = res['dbsources'];
      
    });


    
  }

  public openInvalidResourceModal(resource: Resource): void {
    this.dialog.open(ResourceInvalidModalComponent,
      {
        width: '40%',
        position: {
          top: '15vh'
        },
        data: {
          resource
        }
      });
  }

  getParams(resource) {
    const index = resource.parameters.findIndex(el => el.in.toLowerCase() === 'body' && el.modelName !== null && el.modelName !== '');
    let paramTooltip = '';
    if (index >= 0) {
      paramTooltip += 'Request : ' + resource.parameters[index].modelName + '\n';
    }
    const responseIndex = resource.responses.findIndex(el => el.code > 199 && el.code < 300 && el.schema !== null);
    if (responseIndex >= 0) {
      if (resource.responses[responseIndex].schema.ref !== null && resource.responses[responseIndex].schema.ref !== '') {
        paramTooltip += 'Response : ' + resource.responses[responseIndex].schema.ref + '\n';
      }
    }
    if (resource.parameters.filter(el => el.in.toLowerCase() !== 'body').length > 0) {
      paramTooltip += 'Request Params : {\n';
      resource.parameters.filter(el => el.in.toLowerCase() !== 'body').forEach(el => {
        paramTooltip += '  ' + el.name + ' : ' + el.type + '\n';
      });
      paramTooltip += '}\n';
    }
   
    return paramTooltip;
  }

  /** Check if the selected resource already checked
   * Add it to resource array to delete if not found, else remove it from the array
   */
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

  /** Open Edit Resource Modal for a given Resource Object */
  public openResourceEditModal(resourceEdit: Resource, i: number): void {
    const doc = document.documentElement;
    const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);


    const dialogRef = this.dialog.open(ResourceModalComponent,
      {
        position: {
          top: '10px',
        },
        height: '98%',
        width: '100vw',
        panelClass: 'full-screen-modal',
        data: {
          resource: resourceEdit,
          ressourceIndex: this.group.resources.map(x => x.httpMethod + x.path).indexOf(resourceEdit.httpMethod + resourceEdit.path),
          Rgroup: this.group,
          container: this.container,
          editMode: true,
          editorMode: false,
          action: {
            msg: 'popups.resource.edit'
          }
        }
      });


  }

  public getGroupIndex(group: ResourceGroup): number {
    return this.container.resourceGroups.findIndex((x: ResourceGroup) => x.name.toUpperCase() === group.name.toUpperCase());
  }

  public getResourceIndex(resourceSearchIndex: Resource, groupIndex): number {
    return this.container.resourceGroups[groupIndex].resources.findIndex((x: Resource) => (x.path.toUpperCase() === resourceSearchIndex.path.toUpperCase() && x.httpMethod === resourceSearchIndex.httpMethod));
  }

  /** Open a Modal to Show Resource Details */
  public infoApi(api: Resource): void {
    this.dialog.open(ResourceDetailsModalComponent,
      {
        width: '40%',
        position: {
          top: '15vh'
        },
        data: {
          api,
          action: {
            msg: api.path
          }
        }
      });
  }

  /** NG UPLOADER METHOD (Not Used For Now, ABANDONED) */
  public fileOverBase(ev: boolean): void {
    this.hasBaseDropZoneOver = ev;
  }

  public execute(resource: Resource): void {
    this.resourceService.execute(this.container.id, resource.path, resource.executionType.toLowerCase()).subscribe(res => {
      this.executeModalService.openExecuteModal(res);
    });
  }



  public copyAPIURL(resource: Resource) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    const url = location.origin + '/runtime/' + this.container.id + resource.path.toLocaleLowerCase();
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toaster.success(this.translateService.getMessage('toaster.resource.copy'));
  }

  checkResourceState(api) {
    if (!api.executionType) {
      return true;
    }
    if (api.executionType !== 'Query') {
      let emptyBody = true;
      api.parameters.forEach(element => {
        if (element.name === 'body') {
          emptyBody = false;
        }
      });
      if (emptyBody || !api.resourceFile) {
        return true;
      }
      return false;
    }
    return false;
  }
  executeMessage(api) {
    if (this.checkResourceState(api)) {
      return 'no main file was linked OR no body is present';
    } else {
      return 'Execute';
    }
  }

  openFunctionInfoModal(el){
    this.dialog.open(ResourceFunctionModalComponent,
      {
        width: '40%',
        position: {
          top: '15vh'
        },
        data: {
           element : el
        }
      });
  }

}
