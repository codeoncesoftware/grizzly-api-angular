import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import * as fileSaver from 'file-saver';
import {AppTranslateService} from 'src/app/shared/services/app-translate-service';
import {ProjectService} from 'src/app/project/project.service';
import {DockerExport} from 'src/app/shared/models/DockerExport';
import {ExportDockerInfoModalComponent} from './export-docker-info-modal/export-docker-info-modal.component';
import {ConfirmModalService} from 'src/app/shared/confirm-modal/confirm-modal.service';
import {Store} from '@ngrx/store';
import {AuthState} from 'src/app/store/authentication/auth.state';
import {Container} from 'src/app/shared/models/Container';
import {ToastrService} from 'ngx-toastr';

const YAML = require('yaml');

@Component({
  selector: 'app-export-docker-modal',
  templateUrl: './export-docker-modal.component.html',
  styleUrls: ['./export-docker-modal.component.scss']
})
export class ExportDockerModalComponent implements OnInit {
  retention = '';
  description = '';
  containers = [];
  container: any;
  project: any;
  projectId = '';
  dockerExport = new DockerExport();
  dockerExports = [];
  newDockerExport = null;
  userEmail = '';
  authAccessor = 'auth';
  userAccessor = 'user';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog, private projectService: ProjectService, private toaster: ToastrService, private translateService: AppTranslateService, private confirmModalService: ConfirmModalService, public resourceDialogRef: MatDialogRef<ExportDockerModalComponent>, private store: Store<AuthState>,
  ) { }

  ngOnInit() {
    this.containers = this.data.containers.containers;
    this.project = this.data.project;
    this.projectId = this.project.id;
    this.dockerExport.tag = 'Default';
    this.store.select<any>(this.authAccessor).subscribe(resState => {
      this.userEmail = resState[this.userAccessor].email;
    });
    setTimeout(() => {
      this.reload(this.projectId);
    }, 0);
  }

  exportSwagger() {
    if (this.dockerExports.filter(el => el.status === 'Pending').length === 0) {
      this.dockerExport.containerName = this.container.name;
      this.dockerExport.projectId = this.container.projectId;
      this.dockerExport.projectName = this.project.name.replace(' ', '');
      this.dockerExport.retention = this.retention;
      this.dockerExport.description = (this.description === '') ? '-' : this.description;
      this.dockerExport.status = 'Pending';
      this.dockerExport.repoUrl = '-';
      this.dockerExport.databaseType = this.data.dbsource.type;
      this.dockerExport.databaseName = this.data.dbsource.database;
      this.dockerExport.databaseUsername = this.data.dbsource.username;
      this.dockerExport.databasePassword = this.data.dbsource.password;
      this.dockerExport.databaseProvider = this.data.dbsource.provider;
      this.dockerExport.databaseHost = this.data.dbsource.host;
      this.dockerExport.databasePort = this.data.dbsource.port;
      this.dockerExport.userEmail = this.userEmail;
      this.downloadGeneratedSwagger(this.container);
    } else {
      this.toaster.error(this.translateService.getMessage('toaster.docker.pending'));
    }
  }

  setHasFunctions(container: Container, dockerExport: any) {
    container.resourceGroups.forEach(rg => {
      rg.resources.forEach(resource => {
        if (resource.inFunctions.length !== 0 || resource.outFunctions.length !== 0 || resource.functions.length !== 0) {
          dockerExport.hasFunctions = true;
          return dockerExport;
        }
      })
    })
    return dockerExport;
  }

  getColor(docker) {
    switch (docker.status) {
      case 'Success':
        return 'green';
      case 'Pending':
        return '#FF9900';
      case 'Failed':
        return 'red';
    }
  }

  public infoApi(docker): void {
    this.dialog.open(ExportDockerInfoModalComponent,
      {
        width: '40%',
        position: {
          top: '15vh'
        },
        data: {
          docker,
          dockerCompose: this.generateDockerYaml(docker),
          action: {
            msg: 'How to use it'
          }
        }
      });
  }

  /** Generate and Download the corresponding Swagger.json File for the Given Container Id & Name */
  downloadGeneratedSwagger(container) {
    this.dockerExport = this.setHasFunctions(this.container, this.dockerExport);
    this.projectService.exportDocker(this.dockerExport, container.id).subscribe(response => {
      this.toaster.success(this.translateService.getMessage('toaster.docker.exported'));
      response = this.setHasFunctions(container, response);
      this.dockerExports.unshift(response);
      this.newDockerExport = response;
      // this.resourceDialogRef.close();

    });
  }

  /** Save the Generated Json File */
  saveFile(data: any, filename?: string) {
    const blob = new Blob([data], { type: 'text/csv; charset=utf-8' });
    fileSaver.saveAs(blob, filename);
  }

  reload(projectId) {
    this.projectService.findDockerExportsByUser(projectId).subscribe(res => {
      this.dockerExports = res.reverse();
    });
  }

  generateDockerYaml(dockerExport) {
    const dockerComposeNoSqlWithFunction = {
      version: '3',
      services: {
        database: {
          image: 'mongo:7.0',
          container_name: 'database',
          command: 'mongod --port 28017',
          ports: [
            '28017:28017'
          ],
          restart: 'always'
        },
        grizzlyRuntimeFunction: {
          container_name: 'grizzlyRuntimeFunction',
          image: 'public.ecr.aws/f2o9u3j9/grizzly-runtime-function-public:latest',
          ports: [
            '8080:8080'
          ],
          restart: 'always',
          depends_on: [
            'database'
          ],
          environment: [
            'atlasUri=mongodb://database:28017'
          ]
        },
        grizzlyDockerImage: {
          image: dockerExport.repoUrl,
          ports: [
            '8050:8050'
          ],
          restart: 'always',
          depends_on: [
            'database'
          ],
          environment: [
            'mongoUri=mongodb://database:28017/' + dockerExport.projectName + '_' + dockerExport.containerName.replace(/\./g, ''),
            'mongoDatabase=' + dockerExport.projectName + '_' + dockerExport.containerName.replace(/\./g, ''),
            'grizzly-runtime-function-url=grizzlyRuntimeFunction:8080'
          ]
        }
      }
    };
    const dockerComposeNoSql = {
      version: '3',
      services: {
        database: {
          image: 'mongo:7.0',
          container_name: 'database',
          command: 'mongod --port 28017',
          ports: [
            '28017:28017'
          ],
          restart: 'always'
        },
        grizzlyDockerImage: {
          image: dockerExport.repoUrl,
          ports: [
            '8050:8050'
          ],
          restart: 'always',
          depends_on: [
            'database'
          ],
          environment: [
            'mongoUri=mongodb://database:28017/' + dockerExport.projectName + '_' + dockerExport.containerName.replace(/\./g, ''),
            'mongoDatabase=' + dockerExport.projectName + '_' + dockerExport.containerName.replace(/\./g, '')
          ]
        }
      }
    };
    const dockerComposeSqlWithFunction = {
      version: '3',
      services: {
        grizzlyRuntimeFunction: {
          container_name: 'grizzlyRuntimeFunction',
          image: 'public.ecr.aws/f2o9u3j9/grizzly-runtime-function-public:latest',
          ports: [
            '8080:8080'
          ],
          restart: 'always',
        },
        grizzlyDockerImage: {
          image: dockerExport.repoUrl,
          ports: [
            '8050:8050'
          ],
          restart: 'always',
          environment: [
            'databaseName=' + this.data.dbsource.database,
            'databaseProvider=' + this.data.dbsource.provider,
            'databaseUsername=' + this.data.dbsource.username,
            'databasePassword=' + this.data.dbsource.password,
            'databaseHost=' + this.data.dbsource.host,
            'databasePort=' + this.data.dbsource.port,
            'grizzly-runtime-function-url=grizzlyRuntimeFunction:8080'
          ]
        }
      }
    };
    const dockerComposeSql = {
      version: '3',
      services: {
        grizzlyDockerImage: {
          image: dockerExport.repoUrl,
          ports: [
            '8050:8050'
          ],
          restart: 'always',
          environment: [
            'databaseName=' + this.data.dbsource.database,
            'databaseProvider=' + this.data.dbsource.provider,
            'databaseUsername=' + this.data.dbsource.username,
            'databasePassword=' + this.data.dbsource.password,
            'databaseHost=' + this.data.dbsource.host,
            'databasePort=' + this.data.dbsource.port
          ]
        }
      }
    };
    const doc = new YAML.Document();
    if (dockerExport.hasFunctions === true) {
      if (dockerExport.databaseType === 'sql') {
        doc.contents = dockerComposeSqlWithFunction;
      } else {
        doc.contents = dockerComposeNoSqlWithFunction;
      }
    } else {
      if (dockerExport.databaseType === 'sql') {
        doc.contents = dockerComposeSql;
      } else {
        doc.contents = dockerComposeNoSql;
      }
    }
    return doc.toString();
  }

  generateKubernetesDeployment(dockerExport: DockerExport) {
    const deploymentNoSql = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: (dockerExport.projectName + '-' + dockerExport.containerName.replace(/\./g, '') + '-' + dockerExport.tag).toLowerCase(),
        namespace: 'default'
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: {
            app: (dockerExport.projectName + '-' + dockerExport.id + '-' + dockerExport.tag).toLowerCase(),
          }
        },
        template: {
          metadata: {
            labels: {
              app: (dockerExport.projectName + '-' + dockerExport.id + '-' + dockerExport.tag).toLowerCase(),
            }
          },
          spec: {
            containers: [
              {
                name: (dockerExport.projectName + '-' + dockerExport.containerName.replace(/\./g, '') + '-' + dockerExport.tag).toLowerCase(),
                image: dockerExport.repoUrl,
                ports: [
                  {
                    containerPort: 8050
                  }
                ],
                env: [
                  {
                    name: 'mongoDatabase',
                    value: dockerExport.projectName + '_' + dockerExport.containerName.replace(/\./g, '')
                  },
                  {
                    name: 'mongoUri',
                    value: '<Your_MONGO_URI>'
                  }
                ]
              }
            ]
          }
        }
      }
    };
    const deploymentNoSqlWithFunctions = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: (dockerExport.projectName + '-' + dockerExport.containerName.replace(/\./g, '') + '-' + dockerExport.tag).toLowerCase(),
        namespace: 'default'
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: {
            app: (dockerExport.projectName + '-' + dockerExport.id + '-' + dockerExport.tag).toLowerCase(),
          }
        },
        template: {
          metadata: {
            labels: {
              app: (dockerExport.projectName + '-' + dockerExport.id + '-' + dockerExport.tag).toLowerCase(),
            }
          },
          spec: {
            containers: [
              {
                name: (dockerExport.projectName + '-' + dockerExport.containerName.replace(/\./g, '') + '-' + dockerExport.tag).toLowerCase() + '-function',
                image:  'public.ecr.aws/f2o9u3j9/grizzly-runtime-function-public:latest',
                ports: [
                  {
                    containerPort: 8080
                  }
                ]
              },
              {
                name: (dockerExport.projectName + '-' + dockerExport.containerName.replace(/\./g, '') + '-' + dockerExport.tag).toLowerCase(),
                image: dockerExport.repoUrl,
                ports: [
                  {
                    containerPort: 8050
                  }
                ],
                env: [
                  {
                    name: 'mongoDatabase',
                    value: dockerExport.projectName + '_' + dockerExport.containerName.replace(/\./g, '')
                  },
                  {
                    name: 'mongoUri',
                    value: '<Your_MONGO_URI>'
                  },
                  {
                    name: 'grizzly-runtime-function-url',
                    value:  (dockerExport.projectName + '-' + dockerExport.id + '-' + dockerExport.tag).toLowerCase()+':8080'
                  }
                ]
              }
            ]
          }
        }
      }
    };
    const deploymentSql = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: (dockerExport.projectName + '-' + dockerExport.containerName.replace(/\./g, '') + '-' + dockerExport.tag).toLowerCase(),
        namespace: 'default'
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: {
            app: (dockerExport.projectName + '-' + dockerExport.id + '-' + dockerExport.tag).toLowerCase(),
          }
        },
        template: {
          metadata: {
            labels: {
              app: (dockerExport.projectName + '-' + dockerExport.id + '-' + dockerExport.tag).toLowerCase(),
            }
          },
          spec: {
            containers: [
              {
                name: (dockerExport.projectName + '-' + dockerExport.containerName.replace(/\./g, '') + '-' + dockerExport.tag).toLowerCase(),
                image: dockerExport.repoUrl,
                ports: [
                  {
                    containerPort: 8050
                  }
                ],
                env: [
                  {
                    name: 'databaseName',
                    value: dockerExport.databaseName
                  },
                  {
                    name: 'databaseProvider',
                    value: dockerExport.databaseProvider
                  },
                  {
                    name: 'databaseHost',
                    value: dockerExport.databaseHost
                  },
                  {
                    name: 'databasePort',
                    value: dockerExport.databasePort
                  },
                  {
                    name: 'databaseUsername',
                    value: dockerExport.databaseUsername
                  },
                  {
                    name: 'databasePassword',
                    value: dockerExport.databasePassword
                  }
                ]
              }
            ]
          }
        }
      }
    };
    const deploymentSqlWithFunctions = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: (dockerExport.projectName + '-' + dockerExport.containerName.replace(/\./g, '') + '-' + dockerExport.tag).toLowerCase(),
        namespace: 'default'
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: {
            app: (dockerExport.projectName + '-' + dockerExport.id + '-' + dockerExport.tag).toLowerCase(),
          }
        },
        template: {
          metadata: {
            labels: {
              app: (dockerExport.projectName + '-' + dockerExport.id + '-' + dockerExport.tag).toLowerCase(),
            }
          },
          spec: {
            containers: [
              {
                name: (dockerExport.projectName + '-' + dockerExport.containerName.replace(/\./g, '') + '-' + dockerExport.tag).toLowerCase() + '-function',
                image:  'public.ecr.aws/f2o9u3j9/grizzly-runtime-function-public:latest',
                ports: [
                  {
                    containerPort: 8080
                  }
                ]
              },
              {
                name: (dockerExport.projectName + '-' + dockerExport.containerName.replace(/\./g, '') + '-' + dockerExport.tag).toLowerCase(),
                image: dockerExport.repoUrl,
                ports: [
                  {
                    containerPort: 8050
                  }
                ],
                env: [
                  {
                    name: 'databaseName',
                    value: dockerExport.databaseName
                  },
                  {
                    name: 'databaseProvider',
                    value: dockerExport.databaseProvider
                  },
                  {
                    name: 'databaseHost',
                    value: dockerExport.databaseHost
                  },
                  {
                    name: 'databasePort',
                    value: dockerExport.databasePort
                  },
                  {
                    name: 'databaseUsername',
                    value: dockerExport.databaseUsername
                  },
                  {
                    name: 'databasePassword',
                    value: dockerExport.databasePassword
                  },
                  {
                    name: 'grizzly-runtime-function-url',
                    value:  (dockerExport.projectName + '-' + dockerExport.id + '-' + dockerExport.tag).toLowerCase()+':8080'                  }
                ]
              }
            ]
          }
        }
      }
    };

    const doc = new YAML.Document();
    if (dockerExport.hasFunctions === true) {
       if (dockerExport.databaseType === 'sql') {
          doc.contents = deploymentSqlWithFunctions;
       } else {
         doc.contents = deploymentNoSqlWithFunctions;
       }
    } else {
      if (dockerExport.databaseType === 'sql') {
         doc.contents = deploymentSql;
      } else {
        doc.contents = deploymentNoSql;
      }
    }
    return doc.toString();

  }
  generateKubernetesSevice(dockerExport) {
    const serviceWithoutFunctions = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: (dockerExport.projectName + '-' + dockerExport.id + '-' + dockerExport.tag).toLowerCase(),
      },
      spec: {
        ports: [
          {
            port: 8050,
            targetPort: 8050
          }
        ],
        selector: {
          app: (dockerExport.projectName + '-' + dockerExport.id + '-' + dockerExport.tag).toLowerCase(),
        },
        type: 'LoadBalancer'
      }
    };
    const serviceWithFunctions = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: (dockerExport.projectName + '-' + dockerExport.id + '-' + dockerExport.tag).toLowerCase(),
      },
      spec: {
        ports: [
          {
            name : 'microservice',
            port: 8050,
            targetPort: 8050
          },
          {
            name : 'functions',
            port: 8080,
            targetPort: 8080
          }
        ],
        selector: {
          app: (dockerExport.projectName + '-' + dockerExport.id + '-' + dockerExport.tag).toLowerCase(),
        },
        type: 'LoadBalancer'
      }
    };
    const doc = new YAML.Document();
    if (dockerExport.hasFunctions === true) {
      doc.contents = serviceWithFunctions;
    } else {
      doc.contents = serviceWithoutFunctions;
    }
    return doc.toString();
  }
  downloadKubernetesFiles(dockerExport) {
    this.saveFile(this.generateKubernetesDeployment(dockerExport), 'deployment.yml');
    this.saveFile(this.generateKubernetesSevice(dockerExport), 'service.yml');
  }

  downloadDockerCompose(dockerExport) {
    this.saveFile(this.generateDockerYaml(dockerExport), 'docker-compose.yml');
  }

  /** Open Dialog To Confirm Container Delete Action */
  public openConfirmDeleteDialog(docker) {
    this.confirmModalService.openConfirm('popups.docker.delete.title', 'popups.docker.delete.msg', { version: docker.repoUrl })
      .afterClosed().subscribe((data) => {
        if (data) {
          this.projectService.deleteDocker(docker).subscribe(() => {
            this.dockerExports.splice(this.dockerExports.indexOf(docker), 1);
          });
        }
      });
  }
}
