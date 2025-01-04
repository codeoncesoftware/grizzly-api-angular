import { Component, OnInit, Input } from '@angular/core';
import { DBSource } from 'src/app/shared/models/DBSource';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-dbsource-modal-free',
  templateUrl: './dbsource-modal-free.component.html',
  styleUrls: ['./dbsource-modal-free.component.scss']
})
export class DbsourceModalFreeComponent implements OnInit {
  isFr: boolean;
  selectedLanguage: string;

  @Input() dbSource: DBSource;

  constructor() { }

  ngOnInit() {
  }

  setDbName() {
    if (!this.dbSource.database) {
      this.dbSource.database = this.dbSource.name;
    }
  }

}
