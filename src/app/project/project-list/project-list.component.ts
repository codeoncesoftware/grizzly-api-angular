import { Component, OnInit } from '@angular/core';
import { Project } from '../../shared/models/Project';
import { Store } from '@ngrx/store';
import { ProjectsState } from 'src/app/store/project/project.state';
import { MatDialog } from '@angular/material/dialog';
import { ProjectModalComponent } from '../project-modal/project-modal.component';
import { DashboardService } from '../../layout/dashboard/dashboard.service';
import { MessageService } from 'src/app/shared/message-modal/message.service';
import { faCubes } from '@fortawesome/free-solid-svg-icons/faCubes';
import { faCube } from '@fortawesome/free-solid-svg-icons/faCube';
import { faUserShield } from '@fortawesome/free-solid-svg-icons/faUserShield';
import { faServer, faLock, faTag } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  faServer = faServer;
  faLock = faLock;
  faTag = faTag;
  public projectsList: Project[];
  project = new Project();
  limitReached: boolean;
  faCube = faCubes;
  faUserShield = faUserShield;
  faProjectDiagram = faCube;
  
  constructor(public dialog: MatDialog,
    private store: Store<ProjectsState>,
    private dashboardService: DashboardService,
    private messageBoxService: MessageService) { }

  ngOnInit() {
    if (localStorage.getItem('userEmail') !== null) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.store.select('projects').subscribe(state => {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.projectsList = Array.from(new Set(state['projects']));
        this.dashboardService.checkUserLimits().subscribe(res => {
          // eslint-disable-next-line @typescript-eslint/dot-notation
          this.limitReached = !res['ms'];
        });
      });
    }
  }

  // Open the modal with the create project form
  openDialog(): void {
    if (!this.limitReached) {
      this.dialog.open(ProjectModalComponent, {
        // Modal configuration
        width: '70%',
        height: '90vh',
        disableClose: true,
        position: {
          top: '5vh'
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
    } else {
      this.messageBoxService.openInfoLimitReached('project.limit', 'project.limitMsg', {})
        .afterClosed().subscribe(res => { });
    }
  }

}
