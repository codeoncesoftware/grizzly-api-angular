import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Project } from '../shared/models/Project';
import { MatDialog } from '@angular/material/dialog';
import { ProjectModalComponent } from './project-modal/project-modal.component';
import { Router } from '@angular/router';

// NGRX
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';

import { Store } from '@ngrx/store';
import { ProjectsState } from '../store/project/project.state';

import * as project from '../store/project/project.actions';
import { SlideInOutAnimation } from '../shared/animations';
import { DBSource } from '../shared/models/DBSource';
import { ProjectService } from './project.service';
import { ContainerService } from '../container/container.service';

import { Security } from '../shared/models/Security';
import { RoleModalComponent } from './role-modal/role-modal.component';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../shared/message-modal/message.service';
import { AppTranslateService } from '../shared/services/app-translate-service';
import { ShareModalComponent } from './share-modal/share-modal.component';
import { OrganizationService } from '../organization/organization-menu/organization.service';
import { AuthState } from '../store/authentication/auth.state';
import { ExportDockerModalComponent } from '../container/export-docker-modal/export-docker-modal.component';

import * as functionActions from '../store/function/function.actions';
import { FunctionState } from '../store/function/function.state';
import { Container } from '../shared/models/Container';
import { Observable } from 'rxjs';
import { IdentityProvider } from '../shared/models/IdentityProvider';


@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
    animations: [SlideInOutAnimation]
})

export class ProjectComponent implements OnInit {

    project: Project;
    projectToSave = new Project();
    authProject = new Project();

    security = new Security();
    id: string;
    newProjectDescription: string;
    toggleProjectDetails = false;
    toggleSecurityDetails = true;
    dbsourcesList: DBSource[];
    dataSourceName: string;
    databaseName: string;
    provider: string;

    role: string;
    oldRoles: string[];
    modified: boolean;
    unique = true;
    firstProjectId: string;
    containerId: string;
    baseUrl: string;
    datasource: any = {};
    appName: string;
    toggleApiKeysDetails : boolean[] = [false];
    secKeyHide : boolean[] = [false];
    @ViewChild('datasourceSelect', { static: false }) datasourceSelect;
    @ViewChild('databaseSelect', { static: false }) databaseSelect;

    @ViewChild('signinCurl', { static: false }) signinCurl: ElementRef;
    @ViewChild('signinAngular', { static: false }) signinAngular: ElementRef;
    @ViewChild('signupCurl', { static: false }) signupCurl: ElementRef;
    @ViewChild('signupAngular', { static: false }) signupAngular: ElementRef;
    @ViewChild('securedCurl', { static: false }) securedCurl: ElementRef;
    @ViewChild('securedAngular', { static: false }) securedAngular: ElementRef;
    @ViewChild('signinModal', { static: false }) signinModal: ElementRef;
    @ViewChild('signupModal', { static: false }) signupModal: ElementRef;
    @ViewChild('authorization', { static: false }) authorizationModal: ElementRef;

    // Boolean for Disabling Datasources Select
    changeDatasource = true;
    securityForm: UntypedFormGroup;
    firstContainerId: string;
    containers: any;
    // typescript model files
    typescriptModels = [];
    swaggerModelsToDownload = [];
    identityProviderNames = [];
    identityProviders: IdentityProvider[];
    currentIdentityProviders: IdentityProvider[];
    constructor(private router: Router,
        /* eslint-disable @typescript-eslint/indent */
        private store: Store<ProjectsState>,
        private authStore: Store<AuthState>,
        private functionStore: Store<FunctionState>,
        private dialog: MatDialog,
        private messageBoxService: MessageService,
        private formBuilder: UntypedFormBuilder,
        private toaster: ToastrService,
        private projectService: ProjectService,
        private containerService: ContainerService,
        private translateService: AppTranslateService,
        private organizationService: OrganizationService,
        private cdr: ChangeDetectorRef
    ) {
    }
    /* eslint-enable @typescript-eslint/indent */
    ngOnInit() {
        this.baseUrl = window.location.origin;
        this.store.select('projects').subscribe(resState  => {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            this.project = resState['active'];
            this.projectToSave = Object.assign({}, this.project);
            if(this.project.authMSRuntimeURL) {
                // eslint-disable-next-line @typescript-eslint/dot-notation
                const index = resState['projects'].findIndex((p) => p.runtimeUrl === this.project.authMSRuntimeURL);
                // eslint-disable-next-line @typescript-eslint/dot-notation
                this.authProject = resState['projects'][index];
            } else {
                this.authProject = new Project();
            }
            if(this.project.identityProviderIds && this.project.identityProviderIds.length !== 0) {
                this.store.select('identityproviders').subscribe((res: IdentityProvider[]) => {
                    this.identityProviderNames = [];
                    this.currentIdentityProviders = [];
                    this.project.identityProviderIds.forEach(idpIDs => {
                        // eslint-disable-next-line @typescript-eslint/dot-notation
                        this.identityProviders = res['identityproviders'];
                        const idprovider = this.identityProviders.find(idp => idpIDs === idp.id);
                        if(idprovider !== undefined) {
                            this.identityProviderNames.push(idprovider.name);
                            this.currentIdentityProviders.push(idprovider);
                        }
                    })
                })
            } else {
                this.identityProviderNames = [];
            }

            this.store.select('dbsources').subscribe((res: DBSource[]) => {
                // eslint-disable-next-line @typescript-eslint/dot-notation
                this.dbsourcesList = res['dbsources'];
                if (this.project.dbsourceId) {
                    this.selectDataSource(this.project.dbsourceId);
                }
            });
        });

        this.oldRoles = Object.assign([], this.project.roles);
        this.projectService.getAllProjects().subscribe(res => {
            this.firstProjectId = res[0].id;
            this.containerService.getAllContainers(res[0].id).subscribe(containers => {
                this.firstContainerId = containers[0].id;
            });
        });

        this.store.select('containers').subscribe(resState => {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            this.containerId = resState['active'].id;
            this.containers = resState;
        });
        this.securityForm = this.formBuilder.group({
            clientId: ['', Validators.required],
            clientSecret: ['', [Validators.required, Validators.minLength(64), Validators.pattern('[a-zA-Z0-9]*')]],
            tokenExpiration: ['', Validators.required]
        });
    }
    /* eslint-disable  @angular-eslint/use-lifecycle-interface */
    ngAfterViewInit() {
        this.cdr.detectChanges();
    }

    public openProjectModal(index?: number) {
        this.dialog.open(ProjectModalComponent,
            { // Modal configuration
                width: '65%',
                height: '83vh',
                position: {
                    top: '13vh'
                },
                data: {
                    project: this.project,
                    action: {
                        update: true,
                        create: false,
                        msg: 'popups.project.edit'
                    },
                    step: index
                },
            });
    }
    openShareModal() {
        const userAccessor = 'user';
        this.authStore.select('auth').subscribe((userState) => {
            const user = userState[userAccessor];
                this.organizationService.getCurrentUserTeams().subscribe((res: any) => {
                    if (res.length > 0) {
                        this.dialog.open(ShareModalComponent,
                            { // Modal configuration
                                width: '50%',
                                height: 'fit-content',
                                position: {
                                    top: '15vh'
                                },
                                data: {
                                    project: this.project,
                                    datasource: this.datasource,
                                    currentIdentityProviders: this.currentIdentityProviders,
                                    authProject: this.authProject
                                },
                            });
                    } else {
                        this.messageBoxService
                            .openInfo('popups.project.shareTitle', '', {
                                info: {
                                    msg: 'popups.project.shareMsg',
                                },
                            });
                    }
                });
        });
    }
    selectDataSource(dbsourceId) {
        const index = this.dbsourcesList.findIndex((db) => db.id === dbsourceId);

        if (this.dbsourcesList[index]) {
            this.datasource = this.dbsourcesList[index];
            this.dataSourceName = this.dbsourcesList[index].name;
            this.provider = this.dbsourcesList[index].provider;
        }

    }

    showProjectDetails() {
        this.toggleProjectDetails = !this.toggleProjectDetails;
    }
    showSecurityDetails() {
        this.toggleSecurityDetails = !this.toggleSecurityDetails;
    }
    // Open the modal to get confirmation for delete
    public openConfirmDeleteDialog() {
        let linkedProjectsList = 0;
            this.projectService.getAllProjects().subscribe(res => {
                linkedProjectsList = res.filter((p) => p.authMSRuntimeURL !== null && this.project.runtimeUrl !== null && (p.authMSRuntimeURL === this.project.runtimeUrl)).length;
                if(linkedProjectsList !== 0) {
                    this.messageBoxService.openError('popups.project.delete.title', 'popups.project.noDelete',
                {
                    projectName: this.project.name,
                });
                } else {
                    this.messageBoxService.openWarning('popups.project.delete.title', 'popups.project.delete.msg',
                    {
                        projectName: this.project.name,
                        info: {
                            msg: 'messageBox.project.delete',
                            infos: ['messageBox.project.msgDeleteAllVersion', 'messageBox.project.msgDeleteAllFiles']
                        }
                    }).afterClosed().subscribe((data) => {
                        if (data) {
                            this.store.dispatch(new project.DeleteProject(this.project.id));
                            if (!this.project.id) {
                                this.router.navigate(['/app/dashboard']);
                            } else {
                                this.router.navigate(['/app/project/', this.project.id]);
                            }
                        }
                    });
                }
              });
    }
    followMSLink() {
        this.router.navigate(['/app/dashboard']);
        this.router.navigate(['/app/project/', this.authProject.id]);
    }
    saveSecurityConfig() {
        this.store.dispatch(new project.UpdateProject(this.project, 'toaster.project.updated'));
    }

    addRoles() {
        this.dialog.open(RoleModalComponent,
            { // Modal configuration
                width: '50%',
                position: {
                    top: '15vh'
                },
                data: {
                    project: this.project,
                    action: {
                        msg: 'Add Roles'
                    },
                },
            });
    }

    public addNewRole() {
        this.unique = true;
        if (this.role) {
            this.project.roles.forEach(element => {
                if (this.role === element) {
                    this.unique = false;
                }
            });
            if (this.unique) {
                this.project.roles.push(this.role);
            }
            this.modified = true;

        }
        this.role = '';
    }

    public addNewApp() {
        this.unique = true;
        if (this.appName) {
            if( this.project?.authorizedApps?.length !== undefined) {
                this.project.authorizedApps.forEach(element => {
                    if (this.appName === element.clientId) {
                        this.unique = false;
                    }
                });
            }
            if (this.unique) {
                this.projectService.addApp(this.project.id, this.appName).subscribe(res => this.project.authorizedApps = res.authorizedApps);
            }

        }
        this.appName = '';
    }
    showApiKeysDetails(i) {
        this.toggleApiKeysDetails[i] = !this.toggleApiKeysDetails[i];
    }

    showSecretKey(i) {
        this.secKeyHide[i] = !this.secKeyHide[i];
    }

    public deleteApp(clientId: string) {
        this.projectService.deleteApp(this.project.id, clientId).subscribe(res => this.project.authorizedApps = res.authorizedApps);
    }

    /** DELETE Role with a click */
    public deleteRole(i: number) {
        this.modified = true;
        this.project.roles.splice(i, 1);
    }

    confirmChoice() {
        this.store.dispatch(new project.UpdateProject(this.project, 'toaster.project.updated'));
    }
    onInput() {
        this.unique = true;
    }

    copyText(element) {
        const text = element.innerHTML.trim();
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = text;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.toaster.success(this.translateService.getMessage('toaster.resource.copy'));
    }
     copy(element) {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = element;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.toaster.success(this.translateService.getMessage('toaster.resource.copy'));
    }

    openExportDockerModal() {
        this.dialog.open(ExportDockerModalComponent,
            {
                width: '85%',
                height: 'fit-content',
                position: {
                    top: '15vh'
                },
                data: {
                    project: this.project,
                    containers: this.containers,
                    dbsource: this.datasource
                }
            });
    }

    gitSync() {
        this.containers.containers.forEach(container => {
            container.endpointModels.forEach(model => {
                this.addToDownload(model);
            });
        });
        const files = this.downloadSTsFiles();
        this.projectService.syncgit(this.project, files).subscribe(res => {
            this.functionStore.dispatch(new functionActions.GetAllFunctions(this.project.id));

        })
    }

    parseSwaggerModelToTypescript(model) {
        let typescriptClass = 'class ';
        typescriptClass = typescriptClass + model.title + ' { \n';
        model.properties.forEach(prop => {
            const type = ['integer', 'number'].includes(prop.type) ? 'number' : prop.type;
            if (prop.array) {
                typescriptClass += ('\t' + prop.name + ': ' + type + '[]' + '; \n');
            } else {
                typescriptClass += ('\t' + prop.name + ': ' + type + '; \n');
            }
        });
        typescriptClass = typescriptClass + '}';
        this.typescriptModels.push({ className: model.title, typescriptClass });
    }

    addToDownload(model) {
        const index = this.swaggerModelsToDownload.findIndex(el => el.title === model.title);
        (index < 0) ? this.swaggerModelsToDownload.push(model) : this.swaggerModelsToDownload.splice(index, 1);
    }

    downloadSTsFiles() {
        const files = [];
        this.swaggerModelsToDownload.forEach(swaggerModel => {
            this.parseSwaggerModelToTypescript(swaggerModel);
        });
        this.typescriptModels.forEach(tsModel => {
            const blob = new Blob([tsModel.typescriptClass], { type: 'text/csv; charset=utf-8' });
            files.push(new File([blob], tsModel.className + '.ts'));
        });
        return files;
    }

}
