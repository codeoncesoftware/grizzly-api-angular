import { Component, OnInit } from '@angular/core';
import { DBSource } from 'src/app/shared/models/DBSource';
import { DBSourceService } from '../dbsource.service';
import { Store } from '@ngrx/store';
import { DBSourcesState } from 'src/app/store/dbsource/dbsource.state';
import { DbsourceModalComponent } from '../dbsource-modal/dbsource-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DbSourceModalService } from '../dbsource-modal/dbsource-modal.service';
import { DashboardService } from 'src/app/layout/dashboard/dashboard.service';
import { MessageService } from 'src/app/shared/message-modal/message.service';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';

@Component({
  selector: 'app-dbsource-list',
  templateUrl: './dbsource-list.component.html',
  styleUrls: ['./dbsource-list.component.scss']
})
export class DbsourceListComponent implements OnInit {

  dbSourceList: DBSource[] = [];
  fetching = false;
  dots = '.';
  limitReachedDb: boolean;
  faDatabase = faDatabase;
  faCircle=faCircle;
  constructor(public dialog: MatDialog,
              private dbsourceModalService: DbSourceModalService,
              private store: Store<DBSourcesState>, private dashboardService: DashboardService ,  private messageBoxService: MessageService ) { }

  ngOnInit() {

    if(localStorage.getItem('userEmail') !== null) {
      this.store.select('dbsources').subscribe((res: DBSource[]) => {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.dbSourceList = Array.from(new Set(res['dbsources']));
        this.dashboardService.checkUserLimits().subscribe(limit => {
        // eslint-disable-next-line @typescript-eslint/dot-notation
          this.limitReachedDb = !limit['db'];
        });
        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.fetching = res['loading'];
        if (this.fetching === true) {
          this.displayFetchingDots();
        }
      });
    }
  }

  public openDBSourceModal() {
    if(!this.limitReachedDb){
      this.dbsourceModalService.openAdd(null);
    }else{
      this.messageBoxService.openInfoLimitReached('datasource.limit', 'datasource.limitMsg', { })
      .afterClosed().subscribe(res => {});
    }
  }

  public displayFetchingDots() {
    if (this.dots.length > 4) {
      this.dots = '.';
    } else {
      this.dots = this.dots + '.';
    }
   //setTimeout(() => this.displayFetchingDots(), 1000);

    return this.dots;
  }
}
