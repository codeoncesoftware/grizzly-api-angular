import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import { ContainerState } from 'src/app/store/container/container.state';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as containerActions from '../../store/container/container.actions';
import * as projectActions from '../../store/project/project.actions';
import { Contact } from 'src/app/shared/models/Contact';
import { Server } from 'src/app/shared/models/Server';
@Component({
  selector: 'app-swagger-infos-modal',
  templateUrl: './swagger-infos-modal.component.html',
  styleUrls: ['./swagger-infos-modal.component.scss']
})
export class SwaggerInfosModalComponent implements OnInit {

  container: any = {};
  project: any = {};
  contact: any = {};
  license: any = {};
  hostUrl: any = {};
  server = new Server();
  servers = [];
  host = '';
  basePath: '';
  schemes = [];
  public Editor = ClassicEditor;

  // Chips Variables
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  /** Stepper Component */
  @ViewChild('stepper', { static: true }) stepper: MatStepper;
  constructor(
    public dialogRef: MatDialogRef<SwaggerInfosModalComponent>,
    public dialog: MatDialog,
    private store: Store<ContainerState>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.container = this.data.container;
    this.project = this.data.project;
    if (this.container.contact !== null && this.container.contact !== undefined) {
      this.contact = this.container.contact;
    }
    if (this.container.license !== null && this.container.license !== undefined) {
      this.license = this.container.license;
    }
    if (this.container.servers !== null && this.container.servers !== undefined) {
      this.servers = this.container.servers;
    }
    if (this.container.host !== null && this.container.host !== undefined) {
      this.host = this.container.host;
    }
    if (this.container.basePath !== null && this.container.basePath !== undefined) {
      this.basePath = this.container.basePath;
    }
    if (this.container.schemes !== null && this.container.schemes !== undefined) {
      this.schemes = this.container.schemes;
    }
  }

  addServer(server: Server) {
    if (!this.servers.some(el => el.url === server.url)) {
      this.servers.push(server);
      this.server = new Server();
    }
  }

  deleteServer(index) {
    this.servers.splice(index, 1);
  }

  /** MatStepper Actions Control */
  public goBack(stepper: MatStepper): void {
    stepper.previous();
  }

  public goForward(stepper: MatStepper): void {
    stepper.next();
  }
  removeValue(value) {
    const index = this.schemes.findIndex(el => el === value);
    this.schemes.splice(index, 1);
  }


  public addToSchemes(scheme) {
    if (!this.schemes.includes(scheme)) {
      this.schemes.push(scheme);
    }
  }
  save() {
    if (JSON.stringify(this.contact) !== '{}') {
      this.container.contact = this.contact;
    } else {
      this.container.contact = null;
    }
    if (this.servers.length > 0) {
      this.container.servers = this.servers;
    } else {
      this.container.servers = null;
    }
    if (this.schemes.length > 0) {
      this.container.schemes = this.schemes;
    } else {
      this.container.schemes = null;
    }
    if (this.host !== '') {
      this.container.host = this.host;
    } else {
      this.container.host = null;
    }
    if (this.basePath !== '') {
      this.container.basePath = this.basePath;
    } else {
      this.container.basePath = null;
    }
    if (JSON.stringify(this.license) !== '{}') {
      this.container.license = this.license;
    } else {
      this.container.license = null;
    }
    const otherContainers = JSON.parse (localStorage.getItem('otherContainers'));
    const index = otherContainers.findIndex(el => el.id === this.container.id);
    if(index >=0) {
      otherContainers[index].name = this.project.name;
      otherContainers[index].description = this.container.description;
      otherContainers[index].version = this.container.name;
      localStorage.setItem('otherContainers' ,JSON.stringify (otherContainers) );
    }

    this.store.dispatch(new projectActions.UpdateProject(this.project, 'editor.msg.swaggerUpdated'));
    this.store.dispatch(new containerActions.UpdateContainer(this.container, ''));
    this.dialogRef.close();
  }

}
