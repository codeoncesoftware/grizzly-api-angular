import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Database } from 'src/app/shared/models/Database';
import { DBSource } from 'src/app/shared/models/DBSource';
import { Project } from 'src/app/shared/models/Project';
import { Resource } from 'src/app/shared/models/Resource';
import { DBSourcesState } from 'src/app/store/dbsource/dbsource.state';
import { ProjectsState } from 'src/app/store/project/project.state';
import * as dbsourceActions from 'src/app/store/dbsource/dbsource.actions';
import { ContainerState } from 'src/app/store/container/container.state';
import { Container } from 'src/app/shared/models/Container';
import { ContainerService } from 'src/app/container/container.service';
import { FileUploader } from 'ng2-file-upload';
import { DBSourceService } from '../../dbsource.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';

@Component({
  selector: 'app-csvupload',
  templateUrl: './csvupload.component.html',
  styleUrls: ['./csvupload.component.scss']
})
export class CsvuploadComponent implements OnInit {

  @ViewChild('newCollection', { static: false }) newCollectionInput: ElementRef;

  newCollectionName: string;
  oldcollectionName: string;
  provider: string;
  addCollectionBool = false;
  project = new Project();
  emptyCollection = false;
  dbsourcesList: DBSource[] = [];
  databasesList: Database[] = [];
  collectionsList: { database: string, collection: string }[] = [];
  type: string;
  resource: Resource;
  collection: any = null;
  replaceData = false;
  selectedFile: any = null;
  container: Container = new Container();
  csvFormat:string;

  public uploader: FileUploader = new FileUploader({});
  constructor(@Inject(MAT_DIALOG_DATA) public data, private containerStore: Store<ContainerState>, private containerService: ContainerService,
   private dbsourcesStore: Store<DBSourcesState>, private projectStore: Store<ProjectsState>, private dbSourceService: DBSourceService,
   private store: Store<DBSourcesState>, private router: Router, public dialogRef: MatDialogRef<CsvuploadComponent>,
   private toaster: ToastrService,private translateService: AppTranslateService) {}
  projectList: Project[] = [];

  ngOnInit(): void {
    this.collectionsList = [];
    this.resource = { ...this.data.resource };
    this.dbsourcesStore.select('dbsources').subscribe(res => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.dbsourcesList = res['dbsources'];
      this.data.dbsource.databases.forEach(db => db.collections.forEach(c => this.collectionsList.push({database: db.name, collection: c})));
    });
    this.projectStore.select('projects').subscribe(resState => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.projectList = resState['projects'];
    });
  }
  addCollection() {
    this.addCollectionBool = true;
    this.oldcollectionName = this.collection;
    this.newCollectionName = this.collection;
  }
  confirmNewCollection() {
    this.addCollectionBool = false;
    this.emptyCollection = false;
    if (!this.collectionsList.find(coll => coll.collection === this.newCollectionName)) {
      this.collection = this.newCollectionName;
      this.collectionsList = [];
      this.containerService.getAllContainersByDbSourceId(this.data.dbsource.id).subscribe(res => {
        if(res.length === 0) {
          this.container.name = '1.0.0';
          this.containerService.addNewContainerWithAbsentProject(this.container, this.data.dbsource.id, this.data.dbsource.physicalDatabase)
          .subscribe(cc => {
          this.dbsourcesStore.dispatch(new dbsourceActions.AddNewCollection({ dbsourceId: this.data.dbsource.id, databaseName: this.data.dbsource.database, containerId: cc.id, collectionName: this.collection }));
          });
        } else {
          res.forEach(c => {
            this.dbsourcesStore.dispatch(new dbsourceActions.AddNewCollection({ dbsourceId: this.data.dbsource.id, databaseName: this.data.dbsource.database, containerId: c.id, collectionName: this.collection }));
          })
        }
      })
      this.collectionsList.push({database: this.data.dbsource.database, collection:this.collection});

    } else {
      this.cancelNewCollection();
    }
  }
  cancelNewCollection() {
    this.addCollectionBool = false;
    this.newCollectionName = '';
    this.collection = this.oldcollectionName;
  }
  private checkCollection(collection1) {
    if (collection1) {
      this.emptyCollection = false;
      this.collection = collection1;
    }
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
}
validateUpload(){
  this.dbSourceService.uploadCSVfile(this.uploader.queue[0]._file, this.data.dbsource.id, this.collection.collection, this.collection.database, this.replaceData, this.csvFormat)
      .subscribe(res => {
        if(res === 'File added successfully') {
          this.toaster.success(this.translateService.getMessage('toaster.datasource.uploadcsv.added'));
          this.dialogRef.close();
        } else {
          this.toaster.error(this.translateService.getMessage('toaster.datasource.uploadcsv.error'));
        }
      });
}

}
