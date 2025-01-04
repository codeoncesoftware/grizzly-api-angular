import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import * as authActions from './../../store/authentication/auth.actions';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/store/authentication/auth.state';
import * as projectActions from '../../store/project/project.actions';
import * as dbActions from '../../store/dbsource/dbsource.actions';

import { DashboardService } from 'src/app/layout/dashboard/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/shared/models/Project';
import { ProjectService } from 'src/app/project/project.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectModalComponent } from 'src/app/project/project-modal/project-modal.component';

@Component({
  selector: 'app-login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
  userObj = { email: '', password: '' };
  token: string;
  errorMessage: string;
  email = '';
  pass = '';
  logged = true;
  error: boolean;
  // Reset Password Section
  emailToSendResetPass: string;
  resetPasswordBool = false;
  successfulReset = false;
  resetErrorMessage = false;
  githubLoginError = false;
  googleLoginError = false;
  isFr: boolean;
  selectedLanguage: string;
  project = new Project();
projectsList: any[] = [];



  constructor(
    private authService: AuthService,
    private store: Store<AuthState>,
    private router: Router,
    private dashboardService: DashboardService,
    private appTranslateService: AppTranslateService,
    private projectService: ProjectService,
    public dialog: MatDialog,
    private toasterService: ToastrService
  ) { }

  ngOnInit() {
    this.store.select<any>('auth').subscribe(res => {
      if (res.githubError) {
        this.githubLoginError = true;
      }
      if (res.googleError) {
        this.googleLoginError = true;
      }
    });
    // Set i18n Language
    if (localStorage.getItem('grizzly-lang')) {
      this.setLang(localStorage.getItem('grizzly-lang').toLowerCase());
    } else {
      this.setLang(navigator.language);
    }
    if (localStorage.getItem('token')) {
      if (localStorage.getItem('integrateApi') === 'true') {
        const containerIdEditor = localStorage.getItem('containerIdEditor');
        // change container, project and database owner
        this.integrate(containerIdEditor, localStorage.getItem('userEmail'));
      }
      this.router.navigate(['/app/dashboard']);
    }
  }

  setLang(lang: string) {

    this.appTranslateService.setDefaultLang(lang);
    localStorage.setItem('grizzly-lang', lang.toLowerCase());

    if (lang.includes('fr')) {
      this.selectedLanguage = 'FR';
      this.isFr = false;
    } else {
      this.selectedLanguage = 'EN';
      this.isFr = true;
    }

  }



  login() {
    this.userObj.email = this.email;
    this.userObj.password = this.pass;
    this.error = false;
    if (this.email && this.pass) {
      this.authService.login(this.userObj).subscribe(res => {
        if (res) {
          const url = window.location.href;
          this.logged = true;
          // Save selected language
          localStorage.setItem('grizzly-lang', this.selectedLanguage.toLowerCase());
          // eslint-disable-next-line @typescript-eslint/dot-notation
          console.log(res)
          localStorage.setItem('token', res['access_token']);
          localStorage.setItem('userEmail', this.email);
          if (localStorage.getItem('integrateApi') === 'true') {
            // clear containerId in localstorage
            const containerIdEditor = localStorage.getItem('containerIdEditor');

            // change container, project and database owner
            this.integrate(containerIdEditor, this.email);
          }
        
          this.projectService.getAllProjects().subscribe(projects => {
            this.projectsList = projects || [];
                     
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
            this.store.dispatch(new authActions.LoginUser(this.userObj.email));
            
          });
        
      
        
        }
      },
        err => {
          if (err.status === 401) {
            if (err.error === 4011) {
              this.errorMessage = 'auth.signin.errors.validAccount';
            } else if (err.error === 4014) {
              this.errorMessage = 'Github email exists';
            } else if (err.error === 4015) {
              this.router.navigate(['/trial-expired']);
            } else {
              this.errorMessage = 'auth.signin.errors.credentials';
            }
            this.logged = false;
          }
        }
      );
    } else {
      this.error = true;
    }

  }

  integrate(containerIdEditor, email) {
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

  githubLogin() {
    this.authService.redirectGithubLoginPage();
  }

  googleLogin() {
    this.authService.redirectGoogleLoginPage();
  }

  showResetPassword() {
    this.resetPasswordBool = !this.resetPasswordBool;
    this.successfulReset = false;
  }

  resetPassword() {
    const lang = localStorage.getItem('grizzly-lang');

    if (this.emailToSendResetPass) {
      this.authService.sendResetEmail(this.emailToSendResetPass, lang).subscribe(() => {
        this.successfulReset = true;
        this.resetErrorMessage = false;
      },
        err => {
          if (err.status === 401) {
            if (err.error === 4013) {
              this.successfulReset = false;
              this.resetErrorMessage = true;
            }
          }
        }
      );
    }
  }

}
