import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { ContainerService } from '../container.service';
import { ProjectsState } from 'src/app/store/project/project.state';
import { Store } from '@ngrx/store';
import * as containerActions from '../../store/container/container.actions';
import { ContainerState } from 'src/app/store/container/container.state';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as projectActions from '../../store/project/project.actions';
import { Container } from 'src/app/shared/models/Container';

@Component({
  selector: 'app-swagger-url-modal',
  templateUrl: './swagger-url-modal.component.html',
  styleUrls: ['./swagger-url-modal.component.sass']
})
export class SwaggerUrlModalComponent implements OnInit {

  uploader: FileUploader;

  constructor(private router: Router,private containerService: ContainerService, private store: Store<ContainerState>,  public dialogRef: MatDialogRef<SwaggerUrlModalComponent>, private toaster: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.uploader = this.data.uploader;
  }

  fileLinked() {
    this.dialogRef.close(this.uploader);
  }

  uploadFile(fileItem) {
    this.uploader.queue[0] = fileItem;
    this.importSwagger();
  }

  /** Call importSwaggerFile from Service to create a new container from a swagger file (.json/.yml format) */
  importSwagger() {
    this.containerService.importSwaggerOnExistingContainer(this.uploader.queue[0]._file, this.data.containerId, this.data.editor)
      .subscribe(res => {
        this.dispatchActionSuccess(res);
      },
        err => this.toaster.error(err.error.substr(err.error.indexOf(':') + 1)));
  }
  dispatchActionSuccess(res) {
    this.store.dispatch(new containerActions.UpdateContainer(res, 'editor.msg.swaggerImported'));
    if(!this.data.editor) {
      this.router.navigate(['/app/dashboard']).then(r =>
        this.router.navigate(['/app/project/' + res.projectId])
      );
    }
    this.dialogRef.close('success');
  }

}
