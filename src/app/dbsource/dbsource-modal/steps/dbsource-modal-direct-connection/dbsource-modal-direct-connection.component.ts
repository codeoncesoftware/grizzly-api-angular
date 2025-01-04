import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DBSource } from 'src/app/shared/models/DBSource';

@Component({
  selector: 'app-dbsource-modal-direct-connection',
  templateUrl: './dbsource-modal-direct-connection.component.html',
  styleUrls: ['./dbsource-modal-direct-connection.component.scss']
})
export class DbsourceModalDirectConnectionComponent implements OnInit {

  @Input() dbSource: DBSource;
  @Output() checkConnection: EventEmitter<any> = new EventEmitter();
   database: string;

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.ref.markForCheck();
     }

  onCheckConnection() {
    this.checkConnection.emit(this.dbSource);
  }


  isCompleted() {
    if (this.dbSource.name && this.dbSource.host && this.dbSource.port) {
      if (this.dbSource.secured) {
        if (this.dbSource.username && this.dbSource.authenticationDatabase) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }
    return false;
  }
}
