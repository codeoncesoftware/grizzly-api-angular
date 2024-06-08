import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Container } from '../shared/models/Container';
import { MatDialog } from '@angular/material/dialog';
import * as fileSaver from 'file-saver';

// NGRX
import { Store } from '@ngrx/store';
import * as containerActions from '../store/container/container.actions';
import { ContainerState } from '../store/container/container.state';
import { ResourceGroupComponent } from '../resource-group/resource-group.component';
import { SlideInOutAnimation } from '../shared/animations';
import { ContainerService } from './container.service';
import { environment } from 'src/environments/environment';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { SwaggerUrlModalComponent } from './swagger-url-modal/swagger-url-modal.component';
import { ConfirmModalService } from '../shared/confirm-modal/confirm-modal.service';
import { ImportModalService } from './import-modal/impor-modal.service';
import { ContainerModalService } from './container-modal/container-modal.service';
import { LayoutState } from '../store/layout/layout.state';
import { Location } from '@angular/common';
import * as functionActions from '../store/function/function.actions';
import * as layoutActions from '../store/layout/layout.actions';
import { ResourceModalComponent } from '../resource/resource-modal/resource-modal.component';
import { Resource } from '../shared/models/Resource';
import { SwaggerModalService } from './swagger-modal/swagger-modal.service';
import { ProjectsState } from '../store/project/project.state';
import { Project } from '../shared/models/Project';
import { AppTranslateService } from '../shared/services/app-translate-service';
import { ExportModalComponent } from './export-modal/export-modal.component';
import { ExportModelsComponent } from './export-models/export-models.component';
import { ExportDockerModalComponent } from './export-docker-modal/export-docker-modal.component';

import * as dbsourceActions from '../store/dbsource/dbsource.actions';
import * as dunctionActions from '../store/function/function.actions';
import { DBSourcesState } from 'src/app/store/dbsource/dbsource.state';
import { FunctionState } from '../store/function/function.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  animations: [SlideInOutAnimation]
})
export class ContainerComponent implements OnInit {

  showHierarchy = false; // Show Hierarchy

  @Input() projectId: string;
  @Input() provider: string;
  noFilesUploaded: boolean;
  containers: Container[] = [];
  container = new Container();
  selectedIndex = 0;
  toggleContainerDetails = true;
  lock = 0;
  baseUrl: string = environment.baseUrl;
  defaultDescription = 'this is a default description';
  firstContainerId: string;
  project: Project;
  projectUrl: string;

  firstRGExpanded = false;
  public uploader: FileUploader = new FileUploader({});

  @ViewChild(ResourceGroupComponent, { static: false }) resourceGroupComponent: ResourceGroupComponent; // Recource Group Component

  constructor(
    private router: Router,
    private toaster: ToastrService,
    private containerService: ContainerService,
    private store: Store<ContainerState>,
    private dbSourceStore: Store<DBSourcesState>,
    private functionStore: Store<FunctionState>,
    private pojectStore: Store<ProjectsState>,
    private layoutStore: Store<LayoutState>,
    private dialog: MatDialog,
    private swaggerModalService: SwaggerModalService,
    private location: Location,
    private confirmModalService: ConfirmModalService,
    private importModalService: ImportModalService,
    private containerModalService: ContainerModalService,
    private translateService: AppTranslateService) { }

  ngOnInit() {
    this.store.select('containers').subscribe(resState => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.containers = resState['containers'];
      if (this.containers.length > 0 && !this.firstRGExpanded) {
        this.firstContainerId = this.containers[0].id;
        this.containers.forEach(cont => this.layoutStore.dispatch(new layoutActions.ToggleRg(cont.id, 0)));
        this.firstRGExpanded = true;
      }
      // Load Active Container To State One Time Only
      if ((this.lock === 0) && (this.containers.length > 0)) {
        this.store.dispatch(new containerActions.LoadActiveContainer(this.containers[0]));
        this.lock++;
      }
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.container = resState['active'];
      if (this.container.hierarchy && this.container.hierarchy !== 'none') {
        this.noFilesUploaded = false;
      } else {
        this.noFilesUploaded = true;
      }
      this.selectedIndex = this.containers.findIndex(cont => cont.id === this.container.id);
      this.pojectStore.select('projects').subscribe(st => {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.project = st['active'];
        this.projectUrl = window.location.origin + this.containerService.getContainerServerUrl(this.container.id);
      });
    });
  }

  copy() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.projectUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toaster.success(this.translateService.getMessage('toaster.resource.copy'));
  }

  /** Change Active Container On Mat Tab Change */
  updateActiveState(event) {
    // Dispatch action to change the Active Container in the State
    this.store.dispatch(new containerActions.LoadActiveContainerById(this.containers[event.index].id));
    // Change URL Params so on refresh the Active Container will be selected (by Resolver)
    this.location.go('/app/project/' + this.containers[event.index].projectId + '/' + this.containers[event.index].id);
  }

  /** Toggle A Container's Hierarchy */
  showProjectHierarchy() {
    this.showHierarchy = !this.showHierarchy;
  }

  /** Show Project Hierarchy */
  public openHierarchyModal() {
    this.importModalService.openImport({
      showLoadedHierarchy: true,
      showTree: true
    });
  }

  /** Toggle A Container's Details */
  showContainerDetails() {
    this.toggleContainerDetails = !this.toggleContainerDetails;
  }

  /** Open Dialog for Container Import */
  openImportContainerModal() {
    this.containerModalService.openContainerModal({
      projectId: this.projectId,
      containers: this.containers,
      showImportSection: true,
      swagger: false,
      import: 'Import Container with Files',
      action: {
        msg: 'Import Container',
      }
    });
  }

  /** Open Dialog for Container Creation */
  public openAddContainerModal() {
    this.containerModalService.openContainerModal({
      projectId: this.projectId,
      containers: this.containers,
      showImportSection: true,
      swagger: true,
      edit: false,
      import: 'Import Swagger File',
      action: {
        msg: 'popups.container.add'
      }
    });
  }

  // Open dialog for cloning
  public openCloneContainerModal(cont: Container) {
    this.containerModalService.openContainerModal({
      projectId: this.projectId,
      container: cont,
      showImportSection: false,
      containers: this.containers,
      action: {
        edit: false,
        clone: true,
        msg: 'popups.container.clone'
      }
    });
  }

  /** Open Dialog To Get Confirmation To Delete All a Project's Containers */
  openConfirmDeleteAllDialog() {
    this.confirmModalService.openConfirm('popups.container.deleteAll', '', {})
      .afterClosed().subscribe((data) => {
        if (data) {
          this.deleteContainers(this.projectId);
        }
      });

  }

  /** Delete All Containers For A Single Project Based Onthe Given ProjectId */
  deleteContainers(projectId: string) {
    this.store.dispatch(new containerActions.DeleteAllContainers(projectId));
  }

  /** Open dialog for delete */
  public openEditContainerModal(cont: Container) {
    this.containerModalService.openContainerModal({
      projectId: this.projectId,
      containers: this.containers,
      container: cont,
      showImportSection: false,
      action: {
        edit: true,
        clone: false,
        msg: 'popups.container.edit'
      }
    });
  }

  /** Open Dialog To Confirm Container Delete Action */
  public openConfirmDeleteDialog(id: string) {
    this.confirmModalService.openConfirm('popups.container.delete.title', 'popups.container.delete.msg', { version: this.container.name })
      .afterClosed().subscribe((data) => {
        if (data) {
          this.deleteContainerById(id);
        }
      });
  }

  /** Open Dialog To Import Files for A Single Project */
  public openImportProjectModal(id: string, mode: string) {
    this.importModalService.openImport({
      containerID: id,
      mode,
      action: {
        confirm: false,
        msg: 'Import Project'
      },
      showTree: false
    });

  }

  /** Delete container from array after delete from DB */
  public deleteContainerById(id: string) {
    this.store.dispatch(new containerActions.DeleteContainer(id));
  }

  /** Show the "No Containers" Section When the Project has No Containers To Display. In Practice, A Project Will Always Has One Container At Least. */
  hideIfEmpty() {
    if (this.containers.length !== 0) {
      return true;
    }
    return false;
  }

  /** RecourceGroupComponent methods calls */
  RGopenGroupModal() {
    this.resourceGroupComponent.openGroupModal();
  }

  /** Get Confirmation To Delete A Specific ResourceGroup */
  RGopenConfirmDeleteDialog() {
    this.resourceGroupComponent.openConfirmDeleteDialog();
  }

  /** Enable Or Disable A Single Container Based On It's ID, Diable All the Other Containers */
  enableDisableContainer(containerId) {
    this.store.dispatch(new containerActions.EnableDisableContainer(containerId));
  }

  /** export container */
  exportContainer(containerId) {
    if (!this.noFilesUploaded) {
      this.containerService.export(containerId).subscribe(res => {
        const blob = new Blob([res], {
          type: 'application/zip'
        });
        fileSaver.saveAs(blob, containerId + '.zip');
      });
    } else {
      this.downloadGeneratedSwagger(containerId);
    }
  }

  /** Generate and Download the corresponding Swagger.json File for the Given Container Id & Name */
  downloadGeneratedSwagger(containerId) {
    this.containerService.getGeneratedSwagger(containerId, 'dev').subscribe(response => {
      this.saveFile(response.body, response.headers.get('fileName'));
    });
  }

  /** Save the Generated Json File */
  saveFile(data: any, filename?: string) {
    const blob = new Blob([data], { type: 'text/csv; charset=utf-8' });
    fileSaver.saveAs(blob, filename);
  }

  importSwaggerOnExistingContainer() {
    this.containerService.importSwaggerOnExistingContainer(this.uploader.queue[0]._file, this.container.id, 'false')
      .subscribe(res => {
        this.uploader = new FileUploader({});
        this.dispatchActionSuccess(res);
      }, err => this.toaster.error(err.error.substr(err.error.indexOf(':') + 1)));
  }
  dispatchActionSuccess(res) {
    this.store.dispatch(new containerActions.UpdateContainer(res, 'Swagger Imported'));
    this.router.navigate(['/app/dashboard']).then(r =>
      this.router.navigate(['/app/project/' + this.project.id])
    );
  }

  openSwaggerUrlModal() {
    this.dialog.open(SwaggerUrlModalComponent,
      {
        width: '40%',
        position: {
          top: '15vh'
        },
        data: {
          uploader: this.uploader,
          containerId: this.container.id,
          editor: 'false'
        }
      });
  }

  openSwaggerModal() {
    this.swaggerModalService.openModal('false');
  }

  /** Open a Modal To Add a Resource to a Specific ResourceGroup */
  public openAddResourceDialog(): void {
    const doc = document.documentElement;
    const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

    if (top !== 0 || left !== 0) {
      window.scrollTo({ top: 0, left: 0 });
    }


    const modal = this.dialog.open(ResourceModalComponent,
      {
        position: {
          top: '10px',
          right: '10px'
        },
        height: '98%',
        width: '100vw',
        panelClass: 'full-screen-modal',

        data: {
          resource: new Resource(),
          container: this.container,

          editMode: false,
          action: {
            msg: 'popups.resource.add'
          }
        }
      });
    modal.afterClosed().subscribe(() => {
      if (top !== 0 || left !== 0) {
        window.scroll({ top, left, behavior: 'smooth' });
      }
    });
  }

  openExportDockerModal() {
    this.dialog.open(ExportDockerModalComponent,
      {
        width: '50%',
        position: {
          top: '15vh'
        },
        data: {
          project: this.project,
          container: this.container
        }
      });
  }

  openExportModal() {
    this.dialog.open(ExportModalComponent,
      {
        width: '50%',
        position: {
          top: '15vh'
        },
        data: {
          containerId: this.container.id,
        }
      });
  }

  exportModels() {
    this.dialog.open(ExportModelsComponent,
      {
        width: '50%',
        position: {
          top: '10vh'
        },
        data: {
          container: this.container,
        }
      });
  }


}
