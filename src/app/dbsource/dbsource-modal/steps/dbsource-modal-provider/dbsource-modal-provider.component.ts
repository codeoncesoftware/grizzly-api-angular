import { Component, OnInit, Input } from '@angular/core';
import { DBSource } from 'src/app/shared/models/DBSource';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
@Component({
  selector: 'app-dbsource-modal-provider',
  templateUrl: './dbsource-modal-provider.component.html',
  styleUrls: ['./dbsource-modal-provider.component.scss']
})
export class DbsourceModalProviderComponent implements OnInit {

  @Input() dbSource: DBSource;

  constructor() { }

  ngOnInit() {

  }

  changeProvider() {
    switch (this.dbSource.provider) {
      case 'MONGO':
        this.dbSource.port = 27017;
        break;
      case 'MYSQL':
        this.dbSource.port = 3306;
        break;
      case 'MARIADB':
        this.dbSource.port = 3306;
        break;
      case 'POSTGRESQL':
        this.dbSource.port = 5432;
        break;
      case 'AS400':
        this.dbSource.port = 50000;
        break;
      case 'SQLSERVER':
        this.dbSource.port = 1433;
        break;
      default:
        break;
    }
  }

}
