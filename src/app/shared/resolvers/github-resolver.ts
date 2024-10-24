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

@Injectable()
export class GithubResolver implements Resolve<any> {
  constructor(private authService: AuthService, private router: Router, private store: Store<AuthState>,
    private dashboardService: DashboardService, private appTranslateService: AppTranslateService,
    private toasterService: ToastrService) { }



  resolve(route: ActivatedRouteSnapshot): any {


    return this.authService.githubLogin(route.queryParams.code).subscribe(res => {
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
        this.router.navigate(['/app/dashboard']);
        this.store.dispatch(new authActions.LoginUser(email));
      }
    }, (err) => {
      console.log(err);
      this.store.dispatch(new authActions.LoginGithubError(true));
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
