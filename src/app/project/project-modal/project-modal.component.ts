import {Component,OnInit,Inject,ViewChild,ElementRef,} from '@angular/core';
import {MatDialogRef,MAT_DIALOG_DATA,MatDialog,} from '@angular/material/dialog';
import { Project } from 'src/app/shared/models/Project';
import { ProjectService } from '../project.service';

// REDUX
import { Store } from '@ngrx/store';
import { ProjectsState } from '../../store/project/project.state';

import * as project from '../../store/project/project.actions';
import * as dbsourceActions from '../../store/dbsource/dbsource.actions';
import { DBSource } from 'src/app/shared/models/DBSource';
import { Database } from 'src/app/shared/models/Database';
import { MatStepper } from '@angular/material/stepper';

import { DBSourcesState } from 'src/app/store/dbsource/dbsource.state';
import { DBSourceService } from 'src/app/dbsource/dbsource.service';
import { DashboardService } from 'src/app/layout/dashboard/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { DbSourceModalService } from 'src/app/dbsource/dbsource-modal/dbsource-modal.service';
import { OrganizationsState } from 'src/app/store/organization/organization.state';
import { ResourceService } from 'src/app/resource/resource.service';
import { IdentityProvider } from 'src/app/shared/models/IdentityProvider';
import { IdentityProviderModalService } from 'src/app/identity-provider/identityprovider-modal/identityprovider-modal.service';
import { faCubes } from '@fortawesome/free-solid-svg-icons/faCubes';
import { faCube } from '@fortawesome/free-solid-svg-icons/faCube';
import { faUserShield } from '@fortawesome/free-solid-svg-icons/faUserShield';
@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.scss'],
})
export class ProjectModalComponent implements OnInit {
  // Store old project Name to save Project Name Unicity check when name is not changed
  oldProjectName: string;
  // Variable to store our project informations
  obj = new Project();
  // Store our project informations to keep same data if update is cancelled
  projectToUpdate = new Project();
  faCube = faCubes;
  faUserShield = faUserShield;
  faProjectDiagram = faCube;
  // Git variables
  gitUrl: string;
  gitUrlBeforeCheck: string;
  branchsList: string[] = [];
  branch = 'master';
  loadingBranches = false;
  checksuccess = false;
  gitbranch: string;
  gitBranch = 'master';
  gitRepoType = 'public';
  gitUsername: string;
  gitPassword: string;
  gitToken: string;
  gitError = false;
  addBranchBool = false;
  unexpectedErrorMsg: string;
  hide = false;
  loading = false;

  uniqueProjectName = true;
  uniqueDbName = true;
  reloadProjects = false;

  dbsourcesList: DBSource[];
  databasesList: Database[];
  dataSourceName: string;
 

  identityproviderList: IdentityProvider[];
  removable = true;
  selectable = true;
  selectedIdentityProvidersONAuthMS: IdentityProvider[] = [];
  validChoosedIdentityProviderByType = false;
  projectWithTypeList: Project[];
  createDefaultDb = false;
  createDefaultIP = true;
  securityConfig = false;
  analyticMicroservice = false;
  dbOutKafka = false;
  dbOutMongo = false;
  userManagementEnabled = false;
  list: string[] = [];
  iamDelegatedSecurityProjectId: string;
  createDefaultGrizzlyIdP = false;
  withSynchronisationGit = false;
  /** Stepper Component */
  @ViewChild('stepper', { static: true }) stepper: MatStepper;
  @ViewChild('gitbranch', { static: false }) newGitBranchInput: ElementRef;

  constructor(
    private store: Store<ProjectsState>,
    private identityproviderModalService: IdentityProviderModalService,
    private organizationStore: Store<OrganizationsState>,
    private dbstore: Store<DBSourcesState>,
    private resourceService: ResourceService,
    private projectService: ProjectService,
    private dbSourceService: DBSourceService,
    public dialogRef: MatDialogRef<ProjectModalComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toaster: ToastrService,
    private dashboardService: DashboardService,
    private dbsourceModalService: DbSourceModalService,
    private translateService: AppTranslateService,
  ) {}

  ngOnInit() {
    // If a select database button is clicked, open the second step
    if (this.data.step) {
      this.stepper.selectedIndex = this.data.step;
    }
    this.branchsList.push('master');
    this.gitbranch = 'master';
    // Make a Copy of the Object
    this.obj = { ...this.data.project };
    // Get Objects From State
    this.store.select('projects').subscribe(resState => {
        if (this.data.action.update === true) {
            // eslint-disable-next-line @typescript-eslint/dot-notation
        this.obj = resState['active'];
        this.obj.gitBranch = this.obj.gitBranch;
        this.securityConfig = this.obj.securityEnabled;
        if(this.obj.identityProviderIds !== null && this.obj.identityProviderIds.length === 1 && this.obj.identityProviderIds[0] === 'Grizzly') {
          this.createDefaultGrizzlyIdP = true;
        }
        if (this.obj.type !== 'authentication microservice' && this.obj.authMSRuntimeURL === null) {
          this.createDefaultIP = true;
        } else {
          this.createDefaultIP = false;
        }
      } else {
        this.obj.identityProviderIds = [];
      }
      this.store.select<any>('dbsources').subscribe((res: DBSource[]) => {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.dbsourcesList = res['dbsources'];
        if (this.obj.dbsourceId) {
          this.selectDataSource(this.obj.dbsourceId);
        }
        this.organizationStore.select('organization').subscribe(organState => {
            const organizationAccessor = 'organization';
            if (organState[organizationAccessor].length > 0) {
              this.obj.organizationId = organState[organizationAccessor][0].id;
            }
          });
      });
    });
    this.store.select<any>('identityproviders').subscribe((res) => {
        this.identityproviderList = res.identityproviders;
      });
  }

  confirmNewBranch() {
    this.obj.gitBranch = this.gitBranch;
    this.branchsList.push(this.gitBranch);
    this.addBranchBool = false;
  }
  cancelNewBranch() {
    this.addBranchBool = false;
  }

  addNewBranch() {
    this.addBranchBool = true;
  }

  // Show "Check" Btn if the GitRepoUrl change
  showCheckBtn() {
    this.checksuccess = false;
  }

  checkEndModal() {
   if(this.securityConfig && this.withSynchronisationGit && !this.createDefaultDb && this.data.action.create && this.obj.type === 'microservice') {
        return this.stepper.selectedIndex !== 4;
    }
    //microservice
    if(this.securityConfig && !this.withSynchronisationGit && !this.createDefaultDb && this.data.action.create && this.obj.type === 'microservice') {
      return this.stepper.selectedIndex !== 3;
    }
    if(!this.securityConfig && !this.withSynchronisationGit && !this.createDefaultDb && this.data.action.create && this.obj.type === 'microservice') {
     return this.stepper.selectedIndex !== 2;
    }

     if(this.securityConfig && !this.withSynchronisationGit && this.createDefaultDb && this.data.action.create && this.obj.type === 'microservice') {
      return this.stepper.selectedIndex !== 2;
    }
    //authentication microservice
     if( !this.withSynchronisationGit  && this.data.action.create && this.obj.type === 'authentication microservice') {
      return this.stepper.selectedIndex !== 2;
    }
     if( this.withSynchronisationGit  && this.data.action.create && this.obj.type === 'authentication microservice') {
     return this.stepper.selectedIndex !== 3;
    }
    if(this.analyticMicroservice &&  this.obj.type === 'microservice') {
      return this.stepper.selectedIndex !== 4;
    }
 if(this.createDefaultDb && !this.withSynchronisationGit && ((!this.securityConfig && this.obj.type === 'microservice') || (this.data.action.create && this.obj.type === 'markup microservice') )) {
      return this.stepper.selectedIndex !== 1;
    }

    if(this.createDefaultDb && ((!this.securityConfig && this.obj.type === 'microservice') || (this.data.action.create && this.obj.type === 'markup microservice') )) {
      return this.stepper.selectedIndex !== 2;
    }
    if(this.data.action.update && (this.obj.type === 'markup microservice' || this.obj.type === 'authentication microservice' ||
    (!this.securityConfig && this.obj.type === 'microservice'))) {
      return this.stepper.selectedIndex !== 2;
    }
    return this.stepper.selectedIndex !== 3;
    }

  public getBranchsList(gitRepoUrl) {
    this.addBranchBool = false;
    this.gitUrlBeforeCheck = this.gitUrl;
    this.loadingBranches = true;
    this.unexpectedErrorMsg = null;
    this.resourceService.getBranchsList(this.obj.gitUrl,this.obj.gitUsername,this.obj.gitPassword,this.obj.gitToken).subscribe(
        (branchsList: string[]) => {
          this.branchsList = branchsList;
          this.loadingBranches = false;
          this.gitBranch = branchsList[0];
          this.obj.gitBranch = branchsList[0];
          this.checksuccess = true;
          this.gitError = false;
        },
        (error) => {
          console.log(error);
          this.loadingBranches = false;
          this.checksuccess = false;
          this.hide = false;
          if (error.status === 401) {
            this.gitError = true;
            console.log(error);
            // this.unexpectedErrorMsg = error.error.error.substring(error.error.lastIndexOf(':') + 1).toUpperCase();
            this.unexpectedErrorMsg ='Repository is private please check your credentials';
          }
        }
      );
  }

  selectDataSource(dbsourceId) {
    const index = this.dbsourcesList.findIndex((db) => db.id === dbsourceId);
    if (index >= 0) {
      this.dataSourceName = this.dbsourcesList[index].name;
      this.databasesList = this.dbsourcesList[index].databases; 
    } 

  }
  remove(value) {
    const index = this.obj.identityProviderIds.findIndex(el => el === value);
    this.obj.identityProviderIds.splice(index, 1);
    const index1 = this.selectedIdentityProvidersONAuthMS.findIndex(ip => ip.id === value);
    this.selectedIdentityProvidersONAuthMS.splice(index1, 1);
  }
  selectIP(identityProviderId) {
    if (!this.obj.identityProviderIds.includes(identityProviderId)) {
      const index = this.identityproviderList.findIndex(ip => ip.id === identityProviderId);
      if (index !== -1 && !this.selectedIdentityProvidersONAuthMS.includes(this.identityproviderList[index])) {
        const index1 = this.selectedIdentityProvidersONAuthMS.findIndex(ip => ip.name === this.identityproviderList[index].name);
        if(index1 === -1) {
          this.obj.identityProviderIds.push(identityProviderId);
          this.selectedIdentityProvidersONAuthMS.push(this.identityproviderList[index]);
        }
      }
    }
  }
  selectAuthenticationService(authenticationServiceId) {
    const index = this.projectWithTypeList.findIndex((ip) => ip.id === authenticationServiceId);
    if (index >= 0) {
      if(this.projectWithTypeList[index].id) {
        this.obj.authMSRuntimeURL = this.projectWithTypeList[index].runtimeUrl;
        this.obj.iamDelegatedSecurity = this.projectWithTypeList[index].name;
      }
    }
  }
  onInput() {
    this.uniqueProjectName = true;
  }

  checkGitValidation(obj) {
    if (obj.gitUrl === undefined || obj.gitUrl === '' || obj.gitUrl === null) {
      return false;
    } else {
      if((this.obj.type === 'authentication microservice' || (this.obj.type === 'markup microservice' && !this.createDefaultDb)) && this.stepper.selectedIndex === 3) {
        return true;
      }
      if(this.stepper.selectedIndex === 2 && this.createDefaultDb && (this.obj.type === 'markup microservice' || !this.obj.securityEnabled)) {
        return true;
      }
      if(this.data.action.update && (this.obj.type === 'authentication microservice' || this.obj.type === 'markup microservice' ||
      (!this.obj.securityEnabled && this.obj.type === 'microservice')) && this.stepper.selectedIndex === 2) {
        return true;
      }
      if(this.obj.type === 'microservice') {
        if((this.obj.securityEnabled && this.createDefaultDb || (!this.obj.securityEnabled && !this.createDefaultDb) || this.data.action.update) && this.stepper.selectedIndex === 3) {
          return true;
        }
        if(this.obj.securityEnabled && !this.createDefaultDb && this.stepper.selectedIndex === 4) {
          return true;
        }
      }
    }
  }

 
// Create a New Project With the given form
  public validateProject() {
    this.unexpectedErrorMsg = null;
    if (this.stepper.selectedIndex !== 0) {
      // in case of an update, no need to check if it's the same name
      let test = false;
      if (this.obj.name !== this.data.project.name) {
        test = true;
      }
      this.obj.gitBranch = this.gitBranch;
      if (this.obj.gitPassword === null || this.obj.gitPassword === undefined) {
        this.obj.gitPassword = '';
      }
      if (this.obj.type === 'authentication microservice') {
        this.obj.securityEnabled = true;
        this.createDefaultIP = false;
        if(this.createDefaultGrizzlyIdP) {
          this.obj.identityProviderIds = [];
          this.obj.identityProviderIds.push('Grizzly');
        }
      } else {
        this.obj.analyticMicroservice = this.analyticMicroservice;
        this.obj.securityEnabled = this.securityConfig;
        if(this.createDefaultIP === true) {
          this.obj.authMSRuntimeURL = null;
          this.obj.iamDelegatedSecurity = null;
        }
      }
      if (this.checkGitValidation(this.obj)) {
       
        this.projectService.checkGitcredentials(this.obj).subscribe((res) => {
          if (res === true) {
            this.checkProjectNameUnicityThenSave(test);
          } else {
            this.gitError = true;
            this.unexpectedErrorMsg ='Repository is private please check your credentials';
          }
        });
      } else {
        this.checkProjectNameUnicityThenSave(test);
      }
    }
  }
  private checkProjectNameUnicityThenSave(test) {
    this.projectService.checkProjectNameUnicity(this.obj.name, this.obj.id).subscribe(
        (res) => {
          if (res === true && test) {
            this.uniqueProjectName = false;
            this.stepper.selectedIndex = 1;
          } else {
            this.uniqueProjectName = true;
            if((this.obj.securityEnabled && this.obj.type !== 'authentication microservice' && this.createDefaultIP) ||
                (this.obj.type === 'authentication microservice' && this.createDefaultGrizzlyIdP)) {
                  this.dbSourceService.getDBSourceById(this.obj.dbsourceId).subscribe(dbS => {
                    if(dbS.type === 'nosql' && !this.checkAuthCollection(dbS)) {
                      dbS.authDBEnabled = true;
                      this.dbstore.dispatch(new dbsourceActions.UpdateDBSource(dbS));
                    }
                  })
                }
            if (this.data.action.create === true) {
              if (this.createDefaultDb) {
                this.createProjectWithDefaultDb();
              } else {
                this.store.dispatch(new project.AddProject(this.obj));
              }
            } else {
              this.store.dispatch(new project.UpdateProject(this.obj, 'toaster.project.updated'));
            }
            this.dialogRef.close();
          }
        },
        (error) => {}
      );
  }

  private createProjectWithDefaultDb() {
    this.dashboardService.checkUserLimits().subscribe((metrics) => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      if (!metrics['ms']) {
        this.toaster.error(this.translateService.getMessage('toaster.project.limit'));
        this.dialogRef.close();
        // eslint-disable-next-line @typescript-eslint/dot-notation
    } else if (!metrics['db']) {
        this.toaster.error(this.translateService.getMessage('toaster.datasource.limit'));
        this.dialogRef.close();
    } else {
        const db = new DBSource();
        // DB name can not contain spaces
        db.name = this.obj.name.replace(new RegExp(' ', 'g'), '_');
        db.userEmail = this.obj.userEmail;
        db.database = db.name;
        db.type = 'nosql';
        db.provider = 'MONGO';
        if(this.obj.securityEnabled && this.obj.type !== 'authentication microservice' && this.createDefaultIP) {
          db.authDBEnabled = true;
        } else {
          db.authDBEnabled = false;
        }
        this.dbSourceService.checkUnicity(db.name, null).subscribe((res) => {
          if (res === true) {
            this.dbSourceService.saveDBSource(db).subscribe((dbRes) => {
              this.dbstore.dispatch(
                new dbsourceActions.AddDBSourceSuccess(dbRes)
              );
              this.obj.dbsourceId = dbRes.id;
              this.obj.databaseName = dbRes.name;
              this.store.dispatch(new project.AddProject(this.obj));
              this.dialogRef.close();
            });
          } else {
            this.uniqueDbName = false;
          }
        });
      }
    });
  }

  public openDataSourceModal() {
    this.dbsourceModalService.openAdd(null);
  }
  public openIdentityProviderModal() {
    this.identityproviderModalService.openAdd(null);
  }

  /** MatStepper Actions Control */
  public goBack(stepper: MatStepper): void {
    stepper.previous();
  }

  public goForward(stepper: MatStepper): void {
    if(this.data.action.update && this.obj.type === 'authentication microservice' && stepper.selectedIndex === 0) {
    this.obj.identityProviderIds.forEach(id => {
      const index = this.identityproviderList.findIndex(ip => ip.id === id);
      if (index !== -1 && this.selectedIdentityProvidersONAuthMS.findIndex(sIP => sIP.id === id) === -1) {
        this.selectedIdentityProvidersONAuthMS.push(this.identityproviderList[index]);
      }
    });
    }
    if (stepper.selectedIndex !== 0) {
      this.projectService.getProjectByType('authentication microservice').subscribe((p: Project[]) => {
        this.projectWithTypeList = p;
        if(p.find(proj => this.obj.iamDelegatedSecurity === proj.name)) {
          this.iamDelegatedSecurityProjectId = p.find(proj => this.obj.iamDelegatedSecurity === proj.name).id;
        }
      });
      this.projectService.checkProjectNameUnicity(this.obj.name, this.obj.id).subscribe((res) => {
          if (res === true) {
            this.uniqueProjectName = false;
          } else {
            stepper.next();
          }
        });
    } else {
      stepper.next();
    }
  }

  public isCouchDB(dbSourceId): boolean {
    if (dbSourceId &&this.dbsourcesList.find((db) => db.id === dbSourceId && db.provider === 'COUCHDB')) {
      this.obj.databaseName = undefined;
      return true;
    }
    return false;
  }
  private checkAuthCollection(dbS:DBSource): boolean {
    if(dbS.databases !== null) {
      dbS.databases.forEach(db => {
        if(db.collections !== null && db.collections.includes('authentication_user')) {
          return true;
        }
      });

    }
    return false;
  }
}
