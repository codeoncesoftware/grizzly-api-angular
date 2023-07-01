import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { Project } from '../../shared/models/Project';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { ProjectsState } from 'src/app/store/project/project.state';
import { MatDialog } from '@angular/material/dialog';
import { ProjectModalComponent } from '../project-modal/project-modal.component';
import { Container } from 'src/app/shared/models/Container';
import { DashboardService } from '../../layout/dashboard/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'src/app/shared/message-modal/message.service';
import { faCubes } from '@fortawesome/free-solid-svg-icons/faCubes';
import { faCube } from '@fortawesome/free-solid-svg-icons/faCube';
import { faUserShield } from '@fortawesome/free-solid-svg-icons/faUserShield';
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  public projectsList: Project[];
  project = new Project();
  limitReached: boolean;
  faCube = faCubes;
  faUserShield = faUserShield;
  faProjectDiagram = faCube;
  constructor(public dialog: MatDialog, private store: Store<ProjectsState>,
              private dashboardService: DashboardService ,  private messageBoxService: MessageService ) {
  }

  ngOnInit() {
    if(localStorage.getItem('userEmail') !== null) {
        // tslint:disable-next-line: no-string-literal
        this.store.select('projects').subscribe(state => {
          // tslint:disable-next-line: no-string-literal
          this.projectsList = Array.from(new Set(state['projects']));
          this.dashboardService.checkUserLimits().subscribe(res => {
            // tslint:disable-next-line: no-string-literal
            this.limitReached = !res['ms'];
          });
        });
    }
}

  // Open the modal with the create project form
  openDialog(): void {
    if(!this.limitReached){
      this.dialog.open(ProjectModalComponent, {
        // Modal configuration
        width: '65%',
        height: '83vh',
        position: {
          top: '13vh'
        },
        data: {
          project: this.project,
          action: {
            update: false,
            create: true,
            msg: 'popups.project.add'
          }
        },
      });
    }else{
      this.messageBoxService.openInfoLimitReached('project.limit', 'project.limitMsg', { })
      .afterClosed().subscribe(res => {});
    }
  }

}
