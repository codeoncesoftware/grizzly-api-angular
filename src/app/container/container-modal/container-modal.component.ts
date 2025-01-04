import { Component, OnInit, Inject, Input } from '@angular/core';
import { Container } from 'src/app/shared/models/Container';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContainerService } from '../container.service';
import { Store } from '@ngrx/store';
import * as containerActions from '../../store/container/container.actions';
import { ProjectsState } from 'src/app/store/project/project.state';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { Project } from 'src/app/shared/models/Project';
import { ToastrService } from 'ngx-toastr';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';

@Component({
  templateUrl: './container-modal.component.html',
  styleUrls: ['./container-modal.component.scss']
})
export class ContainerModalComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({});

  activeProject: Project;
  container = new Container();
  uniqueName = true;
  showImportSection = true;
  swaggerUrl: string;

  constructor(private translateService: AppTranslateService, private toaster: ToastrService, private containerService: ContainerService, private store: Store<ProjectsState>, public dialogRef: MatDialogRef<ContainerModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.uploader.onAfterAddingFile = f => {
      if (this.uploader.queue.length > 1) {
        this.uploader.removeFromQueue(this.uploader.queue[0]);
      }
    };
    if (this.data.container) {
      this.container = { ...this.data.container };
      this.container.projectId = this.data.projectId;
    }
    this.store.select('projects').subscribe(state => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.activeProject = state['active'];
    });
  }

  onInput() {
    this.uniqueName = true;
  }

  /** Validate Container Before Upload, Handled both Create, Update and Clone Operations */
  validateContainer(containerAdd: Container) {
    this.container.projectId = this.data.projectId;
    containerAdd.hierarchy = 'none';
    // in case of an update, no need to check if it's the same name
    let test = true;
    if (this.data.action.edit) {
      if (this.container.name === this.data.container.name) {
        test = false;
      }
    }


    if (this.data.containers.filter(container => container.name === containerAdd.name).length > 0 && test) {
      console.log('name not unique');
      this.uniqueName = false;
    } else {
      this.uniqueName = true;
      if (this.data.action.edit) {
        const msg = this.translateService.getMessage('toaster.container.updated');
        this.store.dispatch(new containerActions.UpdateContainer(containerAdd, msg));
      } else {
        if (this.data.action.clone) {
          containerAdd.firstCreation=true;
          this.containerService.clone(containerAdd.id, containerAdd.name).subscribe(clonedContainer => {
            if (clonedContainer.id) {
              this.store.dispatch(new containerActions.AddContainerSuccess(clonedContainer));
             } else {
              this.toaster.error(this.translateService.getMessage('toaster.container.cloneLimit'));
            }
          });
        } else if (this.uploader.queue.length > 0) {
          this.store.dispatch(new containerActions.ImportContainer(this.uploader.queue[0]._file, this.activeProject.id, this.container.name, this.activeProject.dbsourceId, this.activeProject.databaseName));
        } else {
          containerAdd.firstCreation=true;
          this.store.dispatch(new containerActions.AddContainer(containerAdd));
        }
      }
      this.dialogRef.close();
    }
  }

  /** Clear FileList Object */
  clearUploaderQueue() {
    this.uploader.queue = [];
  }

  /**
   * Select only one file, replace the first file in list in case of change
   * @param event : FileList Object
   */


  /** Call importSwaggerFile from Service to create a new container from a swagger file (.json format) */
  importSwagger() {
    this.containerService.importSwaggerFile(this.uploader.queue[0]._file, this.activeProject.id, this.container.name)
      .subscribe(res => this.store.dispatch(new containerActions.AddContainer(res)));
  }

  showSwaggerUrlSection() {
    this.data.showImportSection = !this.data.showImportSection;
  }

  addFileToUpload(file: FileItem) {

    this.uploader.queue[0] = file;
    this.showSwaggerUrlSection();

  }

}
