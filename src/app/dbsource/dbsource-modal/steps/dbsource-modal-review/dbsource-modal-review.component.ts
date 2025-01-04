import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DBSource } from 'src/app/shared/models/DBSource';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';


@Component({
  selector: 'app-dbsource-modal-review',
  templateUrl: './dbsource-modal-review.component.html',
  styleUrls: ['./dbsource-modal-review.component.scss']
})
export class DbsourceModalReviewComponent implements OnInit {
  saveButtonName: string;
  saveButton: string;
  isFr: boolean;
  selectedLanguage: string;
  @Input() unicity: boolean;
  @Input() dbSource: DBSource;
  @Input() selectedFile: File | null = null; 
  @Input() mode: number; // If 0 it means Create new DB, if 0 then iyt is an update
  @Output() save: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
   
  }

  onSave() {
    if (this.dbSource.provider==="BIGQUERY"){
      if (this.selectedFile) {  
        this.save.emit({ dbSource: this.dbSource, selectedFile: this.selectedFile });
       
      
      }}
      else{
        this.save.emit({ dbSource: this.dbSource });      }
  
  }

}
