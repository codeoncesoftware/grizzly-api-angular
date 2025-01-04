import { Component, OnInit, ViewChild, ElementRef, AfterContentInit, OnChanges, EventEmitter, Input, Output } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Resource } from '../shared/models/Resource';
import { EditorService } from './editor.service';
import { ResourceGroup } from '../shared/models/ResourceGroup';
import SwaggerUI from 'swagger-ui';
import { AppTranslateService } from '../shared/services/app-translate-service';
import { APPCONFIG } from '../config';
import { ContainerService } from '../container/container.service';
import { Container } from '../shared/models/Container';
import { ResourceModalComponent } from '../resource/resource-modal/resource-modal.component';
import { ResourceGroupComponent } from '../resource-group/resource-group.component';
import { GroupComponent } from './group/group.component';
import { ProjectService } from '../project/project.service';
import { Project } from '../shared/models/Project';
import { SwaggerUrlModalComponent } from '../container/swagger-url-modal/swagger-url-modal.component';
import { SwaggerModalService } from '../container/swagger-modal/swagger-modal.service';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { ContainerState } from '../store/container/container.state';
import * as containerActions from '../store/container/container.actions';
import * as projectActions from '../store/project/project.actions';
import * as fileSaver from 'file-saver';

import { ProjectsState } from '../store/project/project.state';
import { ConfirmModalService } from '../shared/confirm-modal/confirm-modal.service';
import { JsonViewerComponent } from './json-viewer/json-viewer.component';
import { ExportSwaggerModalComponent } from './export-swagger-modal/export-swagger-modal.component';
import { SwaggerInfosModalComponent } from './swagger-infos-modal/swagger-infos-modal.component';
import { AddModelComponent } from './add-model/add-model.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GenerateModalComponent } from './generate-modal/generate-modal.component';
const YAML = require('json-to-pretty-yaml');
const yaml = require('js-yaml');
import { environment } from '../../environments/environment';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ShareEditorComponent } from './share-editor/share-editor.component';
import { EditorHistoryModalComponent } from './editor-history-modal/editor-history-modal.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @Output()
  public showHelpWidgetEmitted = new EventEmitter();

  @Input()
  showWidget = false;
  grizzlyHubUrl = environment.grizzlyHubUrl;
  groups: ResourceGroup[] = [];
  ui: any;
  swaggerBaseUrl: string;
  project: Project;
  editMode = false;
  hideModels = false;
  AppConfig: any;
  container: Container;
  projectName: string;
  containerName: string;
  containerDescription: string;
  dialogRef: MatDialogRef<JsonViewerComponent>;
  editorTip = 'editor.tip1';
  tips = ['editor.tip1', 'editor.tip2', 'editor.tip3', 'editor.tip4', 'editor.tip5', 'editor.tip6'];
  i = 1;
  src: string;
  thumbnail: any;
  @ViewChild(GroupComponent, { static: false }) resourceGroupComponent: GroupComponent;
  public uploader: FileUploader = new FileUploader({});

  constructor(private containerService: ContainerService,
    public dialog: MatDialog,
    private projectService: ProjectService,
    private toaster: ToastrService,
    private projectStore: Store<ProjectsState>,
    private confirmModalService: ConfirmModalService,
    private store: Store<ContainerState>,
    public el: ElementRef,
    private swaggerModalService: SwaggerModalService,
    private activeRoute: ActivatedRoute,
    private translateService: AppTranslateService,
    private router: Router,
    private editorService: EditorService,
    private sanitizer: DomSanitizer
  ) { }


  ngOnInit() {
    this.AppConfig = APPCONFIG;
    const id = 'id';
    const sharedContainerId = this.activeRoute.snapshot.params[id];
    localStorage.setItem('containerIdEditor', sharedContainerId);
    this.setSwagger(sharedContainerId);
    localStorage.setItem('containerIdEditor', sharedContainerId);
    this.store.select('containers').subscribe(resState => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.container = resState['active'];
      this.containerDescription = this.container.description;
    });
    this.store.select<any>('projects').subscribe(resState => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.project = resState['active'];
      this.projectName = this.project.name;
      if (this.projectName && this.container.name) {
        if (!localStorage.getItem('otherContainers')) {
          localStorage.setItem('otherContainers', '[]');
        }
        if (localStorage.getItem('otherContainers')) {
          const otherContainers = localStorage.getItem('otherContainers');
          if (!otherContainers.includes(sharedContainerId)) {
            const containers = JSON.parse(otherContainers);
            const value = { id: sharedContainerId, description: this.container.description, name: this.projectName, version: this.container.name, creationTime: this.container.creationTime, lastUpdate: this.container.lastUpdate };
            if (JSON.stringify(value) !== '{}') {
              containers.push(value);
              localStorage.setItem('otherContainers', JSON.stringify(containers));
            }
          }
        }
      }

    });

    setInterval(() => this.changeTip(), 5000);
  }
  showHelpWidget() {
    this.showHelpWidgetEmitted.emit();
    this.showWidget = true;
  }
  changeTip() {
    this.editorTip = this.tips[this.i];
    this.i++;
    if (this.i === this.tips.length) {
      this.i = 0;
    }
  }

  private setSwagger(id) {
    this.containerService.getContainerByID(id).subscribe(c => {
      this.container = c;
      this.containerName = c.name;
      this.containerDescription = c.description;
      this.swaggerBaseUrl = window.location.origin + '/api/swagger/' + this.container.exportPreference + '/' + c.id + '/' + c.swaggerUuid;
      this.refreshSwagger();
      this.uploader = new FileUploader({});
      this.store.dispatch(new containerActions.AddContainerSuccess(this.container));

      this.projectService.getProjectByUid(c.projectId).subscribe(p => {
        this.project = p;
        this.projectName = p.name;
        this.projectStore.dispatch(new projectActions.AddProjectSuccess(p));

      });
    }, err => {
      this.generateNewContainer(false);
    });
  }

  public refreshSwagger() {
    this.uploader = new FileUploader({});
    const id = 'id';
    const sharedContainerId = this.activeRoute.snapshot.params[id];
    this.containerService.getGeneratedOpenApi(sharedContainerId, 'prod').subscribe(response => {
      const responseBody = JSON.stringify(yaml.load(response.body));
      this.projectName = JSON.parse(responseBody).info.title !== null ? JSON.parse(responseBody).info.title : 'Untitled';
      this.editorService.getSwaggerStatus(JSON.parse(responseBody)).subscribe((res: any) => {
        const unsafeImageUrl = URL.createObjectURL(res);
        this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
      });
    }, err => {
      console.log(err);
    });
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
  }

  RGopenGroupModal() {
    this.resourceGroupComponent.openGroupModal().afterClosed().subscribe(res => {
      this.containerService.getContainerByID(this.container.id).subscribe(c => {
        this.container = c;
      });
    });
  }

  openSwaggerUrlModal() {
    this.confirmModalService.openConfirm('editor.msg.importSwagger', 'editor.msg.importSwaggerMsg', { name: this.project.name })
      .afterClosed().subscribe(result => {
        if (result) {
          this.dialog.open(SwaggerUrlModalComponent,
            {
              width: '40%',
              position: {
                top: '15vh'
              },
              data: {
                uploader: this.uploader,
                containerId: this.container.id,
                editor: 'true'
              }
            }).afterClosed().subscribe(res => {
              if (res) {
                this.swaggerBaseUrl = window.location.origin + '/api/swagger/' + this.container.exportPreference + '/' + localStorage.getItem('containerIdEditor') + '/' + this.container.swaggerUuid;
                this.refreshSwagger();
              }
            });
        }
      });

  }

  openSwaggerModal() {
    this.swaggerModalService.openModal('true');
  }

  importSwaggerOnExistingContainer() {
    this.confirmModalService.openConfirm('editor.msg.importSwagger', 'editor.msg.importSwaggerMsg', { name: this.project.name })
      .afterClosed().subscribe(result => {
        if (result) {
          this.containerService.getGeneratedOpenApi(this.container.id, 'prod').subscribe(response => {
            const responseBody = JSON.stringify(yaml.load(response.body));
            this.uploader = new FileUploader({});
            this.editorService.getSwaggerStatus(JSON.parse(responseBody)).subscribe((res: any) => {
              const unsafeImageUrl = URL.createObjectURL(res);
              this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
              this.uploader = new FileUploader({});
            });
          }, err => {
            this.uploader = new FileUploader({});
            console.log(err);
          });
          this.containerService.importSwaggerOnExistingContainer(this.uploader.queue[0]._file, this.container.id, 'true')
            .subscribe((res: any) => {
              this.uploader = new FileUploader({});
              this.dispatchActionSuccess(res);
              this.swaggerBaseUrl = window.location.origin + '/api/swagger/' + res.exportPreference + '/' + res.id + '/' + res.swaggerUuid;
              this.refreshSwagger();
            }, (err) => {
              this.toaster.error(err.error.substr(err.error.indexOf(':') + 1));
              this.uploader = new FileUploader({});
            });
        }
      });
  }

  dispatchActionSuccess(res) {
    this.store.dispatch(new containerActions.UpdateContainer(res, 'editor.msg.swaggerImported'));
  }

  clearPage() {
    this.confirmModalService.openConfirm('editor.msg.clearEditor', 'editor.msg.clearMsg', { name: this.project.name })
      .afterClosed().subscribe(res => {
        if (res) {
          this.containerService.clearContainer(this.container.id).subscribe(clearedContainer => {
            const msg = 'editor.msg.editorCleared';
            this.store.dispatch(new containerActions.UpdateContainer(clearedContainer, msg));
            this.refreshSwagger();
          });
        }
      });
  }

  editTitle() {
    // title
    this.dialog.open(SwaggerInfosModalComponent,
      {
        width: '60%',
        height: '83%',
        position: {
          top: '10vh'
        },
        data: {
          container: this.container,
          uploader: this.uploader,
          project: this.project,
          containerId: this.container.id,
          editor: 'true'
        }
      }).afterClosed().subscribe(() => {
        this.setSwagger(this.container.id);
      });
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

  openJsonViewer() {
    this.containerService.getGeneratedSwagger(this.container.id, 'prod').subscribe(response => {
      const swagger = response.body;
      this.containerService.getGeneratedOpenApi(this.container.id, 'prod').subscribe(responseOpenApi => {
        const openApi = JSON.stringify(yaml.load(responseOpenApi.body));

        this.dialogRef = this.dialog.open(JsonViewerComponent,
          {
            width: '75%',
            height: '85vh',
            position: {
            },
            hasBackdrop: true,
            data: {
              swaggerContent: swagger,
              openApiContent: openApi,
              id: this.container.id
            }
          });
        return this.dialogRef;
      });
    });
  }
  Open() {
    this.dialog.open(ExportSwaggerModalComponent,
      {
        width: '40%',
        position: {
          top: '15vh'
        },
        data: {
          container: this.container,
          project: this.project,
        }
      });
  }

  addModel() {
    this.dialog.open(AddModelComponent,
      {
        width: '40%',
        position: {
          top: '15vh'
        },
        data: {
          container: this.container,
          project: this.project,
        }
      }).afterClosed().subscribe(res => {
        setTimeout(() => this.refreshSwagger(), 1000);
      });
  }



  generateNewContainer(openModal) {
    if (openModal) {
      this.confirmModalService.openConfirm('editor.msg.newProject', 'editor.msg.newMsg', {})
        .afterClosed().subscribe(res => {
          if (res) {
            this.editorService.generateNewProject().subscribe(container => {
              this.containerService.getGeneratedOpenApi(container.id, 'prod').subscribe(response => {
                const responseBody = JSON.stringify(yaml.load(response.body));
                this.editorService.getSwaggerStatus(JSON.parse(responseBody)).subscribe((result: any) => {
                  const unsafeImageUrl = URL.createObjectURL(result);
                  this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
                });
              }, err => {
                console.log(err);
              });
              localStorage.setItem('containerIdEditor', container.id);
              window.open('editor/' + container.id, '_blank');
            });
          }
        });
    } else {
      this.editorService.generateNewProject().subscribe(container => {
        localStorage.setItem('containerIdEditor', container.id);
        this.setSwagger(container.id);
        this.router.navigate(['editor/' + container.id]);
      });
    }
  }

  generateServerClient() {
    this.containerService.getSwagger(this.swaggerBaseUrl).subscribe(res => {
      this.dialog.open(GenerateModalComponent,
        {
          width: '70%',
          height: '80%',
          position: {
            top: '15vh'
          },
          data: {
            body: res,
            groups: this.container.resourceGroups
          }
        });
    });
  }

  integrateHub() {
    this.grizzlyHubUrl += '?id=' + this.container.id + '&swagger=' + this.container.swaggerUuid;
    // window.location.href = this.grizzlyHubUrl;
    window.open(this.grizzlyHubUrl, '_blank');
  }

  integrateApi() {
    localStorage.setItem('integrateApi', 'true');
    this.router.navigate(['/login']);
  }

  openShareModal() {
    this.dialog.open(ShareEditorComponent,
      {
        width: '65%',
        height: '70%',
        position: {
          top: '13vh'
        },
        data: {
          container: this.container,
          projectName: this.projectName
        }
      });
  }
  openHistoryModal() {
    this.dialog.open(EditorHistoryModalComponent,
      {
        width: '40%',
        height: 'fit-content',
        position: {
          top: '13vh'
        },
        data: {
        }
      });
  }

  openCloneModal(openModal) {
    if (openModal) {
      this.confirmModalService.openConfirm('editor.msg.cloneProject', 'editor.msg.cloneMsg', {})
        .afterClosed().subscribe(res => {
          if (res) {
            this.editorService.cloneProject(this.project.id, this.container.id).subscribe(container => {
              this.containerService.getGeneratedOpenApi(container.id, 'prod').subscribe(response => {
                const responseBody = JSON.stringify(yaml.load(response.body));
                this.editorService.getSwaggerStatus(JSON.parse(responseBody)).subscribe((result: any) => {
                  const unsafeImageUrl = URL.createObjectURL(result);
                  this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
                });
              }, err => {
                console.log(err);
              });
              window.open('editor/' + container.id, '_blank');
            });
          }
        });
    } else {
      this.editorService.cloneProject(this.project.id, this.container.id).subscribe(container => {
        localStorage.setItem('containerIdEditor', container.id);
        this.setSwagger(container.id);
        this.router.navigate(['editor/' + container.id]);
      });
    }
  }

  public openConfirmDeleteContainer() {
    this.confirmModalService.openConfirm('editor.btn.deleteContainer', 'editor.btn.deleteContainerMsg', { name: this.projectName })
      .afterClosed().subscribe(res => {
        if (res) {
          const otherContainers = JSON.parse(localStorage.getItem('otherContainers'));
          const index = otherContainers.findIndex(el => el.id === this.project.id);
          otherContainers.splice(index, 1);
          localStorage.setItem('otherContainers', JSON.stringify(otherContainers));
          this.store.dispatch(new projectActions.DeleteProject(this.project.id));
          window.location.href = ('https://grizzlyeditor.codeonce.fr/');
        }
      });
  }
}
