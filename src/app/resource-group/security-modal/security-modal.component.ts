import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Resource } from 'src/app/shared/models/Resource';
import { Store } from '@ngrx/store';
import { ContainerState } from 'src/app/store/container/container.state';
import * as containerActions from '../../store/container/container.actions';
import { ProjectService } from '../../project/project.service';

@Component({
  selector: 'app-security-modal',
  templateUrl: './security-modal.component.html',
  styleUrls: ['./security-modal.component.sass']
})
export class SecurityModalComponent implements OnInit {

  rolesList: string[] = [];
  role: string[] = [];
  error: string;
  rolesError = '';

  ngOnInit(): void {

  }

  constructor(public dialogRef: MatDialogRef<SecurityModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private store: Store<ContainerState>,
              private projectService: ProjectService) {

                this.projectService.getProjectByUid(this.data.params.containerToSave.projectId).subscribe( project => {
                  if(project.authMSRuntimeURL !== null) {
                    this.projectService.getRoles(project.authMSRuntimeURL, project.securityConfig.clientId, project.securityConfig.secretKey).subscribe(res => {
                      this.rolesList = res;
                    },
                    err => {
                      // eslint-disable-next-line @typescript-eslint/dot-notation
                      this.rolesError = err['error']['errorMessage'];
                    })
                  } else {
                    this.rolesList = project.roles;
                  }
                });
               }
public getResourceIndex(resourceSearchIndex: Resource, gr): number {
  return gr.findIndex((x: Resource) => x.path.toUpperCase() === resourceSearchIndex.path.toUpperCase() && x.httpMethod === resourceSearchIndex.httpMethod);
}
saveSecurity() {
    this.data.params.resourcesToSecure.forEach((x: Resource) => {
      this.data.params.groupToSecure.resources.forEach(elementToSecure => {
                if (elementToSecure.httpMethod + elementToSecure.path === x.httpMethod + x.path) {
                  elementToSecure.securityLevel = [];
                  if (!this.data.params.securityLevel) {
                    elementToSecure.securityLevel.push('public');
                  } else {
                    this.role.forEach(roleToSecure => {
                      elementToSecure.securityLevel.push(roleToSecure);
                    });

                    if (JSON.stringify(elementToSecure.securityLevel) === JSON.stringify(this.rolesList)) {
                      elementToSecure.securityLevel = ['all'];
                    }
                  }
                }
              });
            });
    this.data.params.containerToSave.resourceGroups[this.data.params.groupIndex] = this.data.params.groupToSecure;
    const msg = 'all selected APIs are Secured';
    this.store.dispatch(new containerActions.UpdateContainer(this.data.params.containerToSave, msg));
    this.dialogRef.close();
  }

}


