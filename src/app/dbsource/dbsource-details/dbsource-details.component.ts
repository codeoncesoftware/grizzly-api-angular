import { Component, OnInit, Input, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { DBSource } from 'src/app/shared/models/DBSource';
import { DBSourceService } from '../dbsource.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DbsourceModalComponent } from '../dbsource-modal/dbsource-modal.component';
import { DBSourcesState } from 'src/app/store/dbsource/dbsource.state';
import { Store } from '@ngrx/store';
import * as dbsourceActions from '../../store/dbsource/dbsource.actions';
import { SlideInOutAnimation } from 'src/app/shared/animations';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { element } from 'protractor';
import { ProjectsState } from 'src/app/store/project/project.state';
import { Project } from 'src/app/shared/models/Project';
import { MessageService } from 'src/app/shared/message-modal/message.service';
import { DbSourceModalService } from '../dbsource-modal/dbsource-modal.service';
import { DbsourceTableDetailsModalComponent } from './dbsource-table-details-modal/dbsource-table-details-modal.component';
import { ToastrService } from 'ngx-toastr';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { MatTableDataSource } from '@angular/material/table';
import { DbsourceCollectionIndexModalComponent } from '../dbsource-collection-index-modal/dbsource-collection-index-modal/dbsource-collection-index-modal.component';

@Component({
  selector: 'app-dbsource-details',
  templateUrl: './dbsource-details.component.html',
  styleUrls: ['./dbsource-details.component.scss'],
  animations: [SlideInOutAnimation]
})
export class DbsourceDetailsComponent implements OnInit,AfterViewChecked {
  firstDbsourceId: string;
  @Input() dbsource: DBSource;
  ourCollections: string[] = ['authentication_user', 'fs.files', 'fs.chunks'];
  query: string;
  databaseName: string;
  collectionName: string;
  collectionsList: string[];
  mongoQuery: string;
  mongoAction: string;
  mongoActions: string[] = [
    'find', 'findOne',
    'findOneAndUpdate',
    'findOneAndReplace',
    'findOneAndDelete',
    'count',
    'insertOne',
    'insertMany',
    'updateOne',
    'updateMany',
    'deleteOne',
    'deleteMany',
    'aggregate'
  ];
  toggleDbsourceDetails = false;

  collectionDetails: any;

  panelOpenState = false;

  projectList: Project[];

  private dialogRef: MatDialogRef<DbsourceTableDetailsModalComponent>;
  private dialogRefIndex: MatDialogRef<DbsourceCollectionIndexModalComponent>;

  displayedColumns: string[] = ['name', 'primary-keys', 'Actions'];
  displayedColumnsMongo: string[] = ['name', 'Actions'];

  oldNameCollection: string;
  constructor(private router: Router,
    private store: Store<DBSourcesState>,
    private projectStore: Store<ProjectsState>,
    private dbSourceService: DBSourceService,
    private confirmModalService: ConfirmModalService,
    private messageBoxService: MessageService,
    public dialog: MatDialog,
    private toaster: ToastrService,
    private translateService: AppTranslateService,
    private activateRoute: ActivatedRoute,
    private dbsourceModalService: DbSourceModalService,
    private cdr: ChangeDetectorRef) { }
    ngAfterViewChecked() {
      this.cdr.detectChanges();
    }
  ngOnInit() {
    this.store.select('dbsources').subscribe(r => {
      this.activateRoute.params.subscribe(param => {
        this.dbSourceService.getDBSourceById(param.id).subscribe((res: any) => {
          this.dbsource = res;
          if (this.dbsource && this.dbsource.databases) {
            const index = this.dbsource.databases.findIndex(db => db.name === this.dbsource.database);
            if (this.dbsource.databases[index]) {
              this.collectionsList = this.dbsource.databases[index].collections;
            }
            if (this.dbsource && !this.dbsource.active) {
              this.collectionsList = [];
            }
          }
        })
      });
    });
    const proj = 'projects';
    this.projectStore.select('projects').subscribe(list => this.projectList = list[proj]);
  }

  checkConnection() {
    this.dbSourceService.checkConnection(this.dbsource).subscribe(res => {
    }, err => {
      if (err.status === 406) {
        if (err.error === 4061) {
          console.log('IllegalArgumentException');
        }
      }
    });
  }




  checkConnectionBigquery() {

    // Convertir un tableau d'Uint8Array en un tableau d'ArrayBuffer
    const arrayBuffers = this.dbsource.privetkeyBigQuery.map(uint8Array => uint8Array.buffer);

    // Concaténer les ArrayBuffers en un seul ArrayBuffer
    const concatenatedArrayBuffer = arrayBuffers.reduce((acc, current) => {
      const newBuffer = new Uint8Array(acc.byteLength + current.byteLength);
      newBuffer.set(new Uint8Array(acc), 0);
      newBuffer.set(new Uint8Array(current), acc.byteLength);
      return newBuffer.buffer;
    });

    // Créer le Blob à partir de l'ArrayBuffer
    const blob = new Blob([concatenatedArrayBuffer]);


    //const blob = new Blob([new Uint8Array(this.dbsource.privetkeyBigQuery)]);
    const file = new File([blob], 'privetkeyBigQuery'); // Vous pouvez donner un nom au fichier
    this.dbSourceService.checkConnectionBigquery(file).subscribe(res => {
    }, err => {
      if (err.status === 406) {
        if (err.error === 4061) {
          console.log('IllegalArgumentException');
        }
      }
    });
  }

  uploadCSVfile() {
    this.dbsourceModalService.openUpload(this.dbsource);
  }

  public openConfirmDeleteDialog() {
    if (this.getLinkedToProject() !== null) {
      this.messageBoxService.openError('popups.dbsource.delete.title', 'popups.dbsource.noDelete',
        {
          projectName: this.projectList.find(proj => proj.dbsourceId === this.dbsource.id).name,
          datasourceName: this.dbsource.name
        });
    } else {
      this.messageBoxService.openWarning('popups.dbsource.delete.title', 'popups.dbsource.delete.msg',
        {
          datasourceName: this.dbsource.name,
          info: {
            msg: 'messageBox.dbsource.delete',
            infos: ['messageBox.dbsource.msgDeleteAllcontent', 'messageBox.dbsource.msgNoBackup']
          }
        })
        .afterClosed().subscribe((data) => {
          if (data) {
            this.store.dispatch(new dbsourceActions.DeleteDBSource(this.dbsource.id));
            this.router.navigate(['/app/dashboard']);
          }
        });
    }
  }

  openEditDBSourceModal() {
    this.dbsourceModalService.openupdate(this.dbsource);
  }

  showDbsourceDetails() {
    this.toggleDbsourceDetails = !this.toggleDbsourceDetails;
  }

  getCollectionStats(databaseName: string, collectionName: string) {
    this.dbSourceService.getCollectionStats(this.dbsource.id, databaseName, collectionName).subscribe(res => {
      // console.log(res);
      // NOT COMPLETED
    });
  }
   
  confirmDropCollection(dbName: string, collName: string) {
    // Appel de la méthode pour vérifier si la collection est utilisée
    this.dbSourceService.getCollectionStatUsed(collName).subscribe((isUsed) => {
        // Si la collection est utilisée, ne pas ouvrir le modal
        if (!isUsed) {
            this.confirmModalService.openConfirm(
                'popups.dbsource.collection.drop.title',
                'popups.dbsource.collection.drop.msg',
                { collectionName: collName }
            ).afterClosed().subscribe((data) => {
                if (data) {
                    this.store.dispatch(new dbsourceActions.DropCollection({
                        dbsourceId: this.dbsource.id,
                        databaseName: dbName,
                        containerId: null,
                        collectionName: collName
                    }));
                }
            });
        } else {
          this.messageBoxService.openError('popups.dbsource.collection.drop.title', 'La collection ' + collName + ' ne peut pas être supprimée car elle est déjà liée à des Endpoints.',{});
          
        }
    });
}



 // Méthode pour activer l'édition
 enableEdit(index: number) {
  // Stockez l'index de l'élément en cours d'édition
  this.editingIndex = index;
  this.oldNameCollection=this.collectionsList[index];
}

  // Méthode pour enregistrer les modifications
  saveEdit(index: number, newValue: string, dbName: string, collName: string) {
   
    if (newValue.trim()) {
      this.collectionsList[index] = newValue; // Met à jour l'élément
      //Mettre à jour le nom de la collection
      this.store.dispatch(new dbsourceActions.UpdateCollectionCustomQuery({ dbsourceId: this.dbsource.id, databaseName: dbName, containerId: null, collectionName: this.oldNameCollection, newCollectionName: newValue }));
      this.store.dispatch(new dbsourceActions.UpdateCollection({ dbsourceId: this.dbsource.id, databaseName: dbName, containerId: null, collectionName: this.oldNameCollection, newCollectionName: newValue }));
      this.editingIndex = null; // Désactive le mode édition

    } else {
      alert("Le nom ne peut pas être vide.");
    }
  }

// Variable pour garder une trace de l'index en cours d'édition
editingIndex: number | null = null;


  showDelete(collection: string) {
    //Ajout d'un Test de vérification si la collection est utilisée ailleurs

    let test = true;
    this.ourCollections.forEach(collectionName => {
      if (collectionName === collection) {
        test = false;
      }
    });
    return test;
  }

  getLinkedToProject(): string {
    const index = this.projectList.findIndex(proj => proj.dbsourceId === this.dbsource.id);
    if (index > -1) {
      return this.projectList[index].name;
    }
    return null;
  }

  openEditTableModal(dbsource, tab, modeValue) {
    this.dialogRef = this.dialog.open(DbsourceTableDetailsModalComponent,
      {
        width: '85%',
        height: '80vh',
        hasBackdrop: true,
        data: {
          dbsource,
          table: tab,
          mode: modeValue
        }
      });
    return this.dialogRef;
  }

  openDeleteTableModal(dbSource, tab) {
    const listRefTables = []
    if (dbSource.provider === 'SQLSERVER') {
      dbSource.databases[0].tables.forEach(table => {
        if (table.constraints !== null) {
          table.constraints.forEach(el => {
            if (el.refTable === tab.name.split('.')[1] && tab.name.split('.')[1] !== table.name.split('.')[1]) {
              listRefTables.push(table.name.split('.')[1]);
            }
          });
        }
      });
    } else {
      dbSource.databases[0].tables.forEach(table => {
        if (table.constraints !== null) {
          table.constraints.forEach(el => {
            if (el.refTable === tab.name && tab.name !== table.name) {
              listRefTables.push(table.name);
            }
          });
        }
      });
    }
    let linkTab = ''
    if (listRefTables.length !== 0) {
      if (localStorage.getItem('grizzly-lang') === 'fr') {
        if (listRefTables.length === 1) {
          linkTab = 'Impossible de supprimer la table [ ' + tab.name + ' ] à causes des contraintes avec la table (' + listRefTables.join(', ') + ')';
        } else {
          linkTab = 'Impossible de supprimer la table [ ' + tab.name + ' ] à causes des contraintes avec les tables (' + listRefTables.join(', ') + ')';
        }
      } else {
        if (listRefTables.length === 1) {
          linkTab = 'You can`t delete the table [ ' + tab.name + ' ] because it\'s linked to the table (' + listRefTables.join(', ') + ')';
        } else {
          linkTab = 'You can`t delete the table [ ' + tab.name + ' ] because it\'s linked to the tables (' + listRefTables.join(', ') + ')';
        }
      }

    } else {
      if (localStorage.getItem('grizzly-lang') === 'fr') {
        linkTab = 'Lorsque vous supprimez une table, cela se produit immédiatement';
      } else {
        linkTab = 'When you delete a Table, this immediately happens';
      }
    }
    let query = (dbSource.provider.toLowerCase() === 'postgresql' || dbSource.provider.toLowerCase() === 'sqlserver') ? 'DROP table ' + tab.name : 'DROP table `' + tab.name + '`';
    if (listRefTables.length !== 0) {
      query += ',' + listRefTables.join(', ') + '';
    }
    this.messageBoxService.openWarning('popups.dbsource.table.delete.title', linkTab,
      {
        tableName: tab.name,
        linkedTables: linkTab,
        info: {}
      }, listRefTables.length !== 0)
      .beforeClosed().subscribe((data) => {
        if (data) {
          if (listRefTables.length === 0) {
            const customQu = {};
            const quer = 'query';
            customQu[quer] = query;
            this.store.dispatch(new dbsourceActions.DropTable({ customQuery: customQu, dbsourceId: this.dbsource.id, tableName: tab.name }));
          }
        }
      });

  }


  deleteTablesFromDbSource(dbSource, tab, listRefTables) {
    listRefTables.push(tab.name)
    listRefTables.forEach(table => {
      const index = dbSource.databases[0].tables.findIndex(el => el.name === table);
      dbSource.databases[0].tables.splice(index, 1);
    });
  }

  openCreateIndexleModal(dbName: string, collName: string) {
    this.dialogRefIndex = this.dialog.open(DbsourceCollectionIndexModalComponent,
      {
        width: '70%',
        height: '90vh',
        hasBackdrop: true,
        disableClose: true,
        data: {
          dbsource: this.dbsource.id,
          dbName,
          collName
        }
      });
    return this.dialogRefIndex;
  }

}
