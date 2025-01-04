import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DBSource } from 'src/app/shared/models/DBSource';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { FileUploader } from 'ng2-file-upload';
import { DBSourceService } from '../../../dbsource.service';
import { DbsourceModalComponent } from '../../../dbsource-modal/dbsource-modal.component';

@Component({
  selector: 'app-dbsource-modal-cloud-connection',
  templateUrl: './dbsource-modal-cloud-connection.component.html',
  styleUrls: ['./dbsource-modal-cloud-connection.component.scss']
})
export class DbsourceModalCloudConnectionComponent implements OnInit {
  isFr: boolean;
  selectedLanguage: string;
  @Input() dbSource: DBSource;
  @Output() checkConnection: EventEmitter<any> = new EventEmitter();
  @Output() selectedFileChange: EventEmitter<File | null> = new EventEmitter<File | null>();

  selectedFile: File | null = null;
  public uploader: FileUploader = new FileUploader({});
  
  
  constructor( private dbsourceService: DBSourceService, private dbsourceModalComponent:DbsourceModalComponent) { }

  ngOnInit() {
   
    
  }

  onCheckConnection() {
    if (this.dbSource.provider==="BIGQUERY"){
    if (this.selectedFile) {  
      this.dbsourceModalComponent.showMessages = true;
      this.dbsourceModalComponent.loading = true;
      this.dbsourceService.checkConnectionBigquery(this.selectedFile)
      .subscribe((result) => {
        this.dbsourceModalComponent.loading = false;
      this.dbSource.connectionSucceeded = result;
      }, (err) => {
        if (err.status === 406) {
          if (err.error === 4061) {
            this.dbSource.connectionSucceeded = false;
          }
        }
      });
  } else {
    console.log('Aucun fichier sélectionné.');
  }}
    else{
      this.checkConnection.emit(this.dbSource);   
    }
  }
  

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    this.selectedFileChange.emit(this.selectedFile);
   }}
