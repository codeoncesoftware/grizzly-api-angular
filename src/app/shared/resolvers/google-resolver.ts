import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/store/authentication/auth.state';
import * as authActions from './../../store/authentication/auth.actions';
import { DashboardService } from 'src/app/layout/dashboard/dashboard.service';
import { AppTranslateService } from '../services/app-translate-service';
import { ToastrService } from 'ngx-toastr';
import * as projectActions from '../../store/project/project.actions';
import * as dbActions from '../../store/dbsource/dbsource.actions';
import { Project } from '../models/Project';
import { ProjectService } from 'src/app/project/project.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectModalComponent } from 'src/app/project/project-modal/project-modal.component';

@Injectable()
export class GoogleResolver implements Resolve<any> {
  project = new Project();
projectsList: any[] = [];
  constructor(private authService: AuthService, private router: Router, private store: Store<AuthState>,
      private projectService: ProjectService,
        public dialog: MatDialog,
    private dashboardService: DashboardService, private appTranslateService: AppTranslateService,
    private toasterService: ToastrService) { }

  resolve(route: ActivatedRouteSnapshot): any {
    return this.authService.googleLogin(route.queryParams.code, route.queryParams.scope, route.queryParams.authuser, route.queryParams.prompt).subscribe(res => {
      if (res) {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        const email = res['email'];
        // eslint-disable-next-line @typescript-eslint/dot-notation
        localStorage.setItem('token', res['access_token']);
        localStorage.setItem('userEmail', email);
        if (localStorage.getItem('integrateApi') === 'true') {
          // clear containerId in localstorage
          const containerIdEditor = localStorage.getItem('containerIdEditor');
          this.integrate(containerIdEditor, email);
        }

        this.projectService.getAllProjects().subscribe(projects => {
          this.projectsList = projects || [];
          console.log('NBR Projets:'+ this.projectsList.length);
        if(this.projectsList.length>0)
                      this.router.navigate(['/app/dashboard']);
                    else{
                      //ouvrir le model d'ajou Microservice
                       this.dialog.open(ProjectModalComponent, {
                              // Modal configuration
                              width: '70%',
                              height: '83vh',
                              disableClose: true,
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
                            this.router.navigate(['/app/dashboard']);
                    } 
       
       
                    this.store.dispatch(new authActions.LoginUser(email));
                  });
      }
    }, (err) => {
      console.log(err);
      this.store.dispatch(new authActions.LoginGoogleError(true));
      this.router.navigate(['/login']);
    });
  }




  private integrate(containerIdEditor, email) {
    this.dashboardService.checkUserLimits().subscribe(res => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      if (res['ms'] && res['db']) {
        this.authService.integrate(containerIdEditor, email).subscribe(integrated => {
          if (integrated) {
            this.store.dispatch(new projectActions.LoadAllProjects());
            this.store.dispatch(new dbActions.LoadAllDBSources());
            this.toasterService.success(this.appTranslateService.getMessage('toaster.project.integrated'));
          } else {
            this.toasterService.error(this.appTranslateService.getMessage('toaster.project.name'));
          }
          localStorage.removeItem('integrateApi');
        });
      } else {
        this.toasterService.error(this.appTranslateService.getMessage('toaster.project.limit'));
        localStorage.removeItem('integrateApi');
      }
    });
  }



}
