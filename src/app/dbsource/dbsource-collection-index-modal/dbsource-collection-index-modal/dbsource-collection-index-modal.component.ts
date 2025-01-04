import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DBSource } from 'src/app/shared/models/DBSource';
import { IndexCollection } from 'src/app/shared/models/IndexCollection';
import { DBSourceService } from '../../dbsource.service';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { DBSourcesState } from 'src/app/store/dbsource/dbsource.state';
import { Store } from '@ngrx/store';
import * as dbsourceActions from 'src/app/store/dbsource/dbsource.actions';


@Component({
  selector: 'app-dbsource-collection-index-modal',
  templateUrl: './dbsource-collection-index-modal.component.html',
  styleUrls: ['./dbsource-collection-index-modal.component.scss']
})
export class DbsourceCollectionIndexModalComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DbsourceCollectionIndexModalComponent>,
    private store: Store<DBSourcesState>, private dbSourceService: DBSourceService, private confirmModalService: ConfirmModalService,) { }

  //columns= [];
  collectionIndex: IndexCollection[];
  database: any;
  dbsource: any;
  // newIndex = { name: '', columns: [], options: [] };
  options = []; // Ce tableau contiendra les options
  newIndex = { name: '', columns: [] }; // Modèle d'index
  columns: { name: string; selected: boolean }[] = [];
  indexName: string; // Le nom de l'index

  ngOnInit(): void {
     //Récupérer la liste des Index de la collection séléctionnée
    this.dbSourceService.getCollectionIndexes(this.data.dbsource, this.data.dbName, this.data.collName).subscribe(
      (indexes: IndexCollection[]) => {
        this.collectionIndex = indexes; // Stocker les index dans collectionIndex
      },
      error => {
        console.error('Erreur lors de la récupération des index:', error);
      }
    );
    this.indexName='';

    this.fetchColumns();
    this.fetchOptions();

  }

  fetchColumns() {
    // Récupération des colonnes de la collection en question
    this.dbSourceService.getCollectionFields(this.data.dbsource, this.data.dbName, this.data.collName).subscribe(
      (data: string[]) => {

        //initialiser la sélection
        this.columns = data.map(name => ({ name, selected: false }));
      },
      (error) => {
        console.error('Erreur lors de la récupération des colonnes:', error);
      }
    );

  }

  fetchOptions() {
    // Remplace cette méthode par l'appel à ton service pour récupérer les options
    this.options = [
      { name: 'Unique', selected: false },
      { name: 'Sparse', selected: false },
      { name: 'Background', selected: false }

    ];
  }

  fetchCollectionIndexes(): void {
    this.dbSourceService.getCollectionIndexes(this.data.dbsource, this.data.dbName, this.data.collName).subscribe(
      (indexes: IndexCollection[]) => {
        this.collectionIndex = indexes; // Stocker les index dans collectionIndex
        console.log('Indexes:', indexes);
      },
      error => {
        console.error('Erreur lors de la récupération des index:', error);
      }
    );
  }
  

  isFormValid(): boolean {
    const isIndexNameFilled = !!this.indexName; // Vérifie si le champ "Index Name" est rempli
    const isAnyColumnSelected = this.columns.some(column => column.selected); // Vérifie si au moins une colonne est cochée

    return isIndexNameFilled && isAnyColumnSelected; // Retourne true si les deux conditions sont remplies
  }
  toggleDbsourceDetails = false;
  showDbsourceDetails() {
    this.toggleDbsourceDetails = !this.toggleDbsourceDetails;
  }

  alertMessage: string | null = null;

  onSubmit() {
    this.alertMessage = null;
    const exists = this.collectionIndex.some(column => column.indexOptions.name === this.indexName);
    if (exists) {
      this.alertMessage = 'Il existe déjà un index avec ce nom.';
      return;
    }else{
      //Verifie si existe un index sur la même combinaison des colonnes
      const selectedColumns = this.columns.filter(col => col.selected).map(col => col.name);
      // Générer une clé pour les colonnes sélectionnées
      const columnKey = this.generateColumnKey(selectedColumns);

      // Vérifier si une combinaison de colonnes existe déjà
      const combinationExists = this.collectionIndex.some(column => {
        const existingKeys = Object.keys(column.indexKeys);
        const existingKey = this.generateColumnKey(existingKeys);
        return existingKey === columnKey;
      });

      if (combinationExists) {
        this.alertMessage = 'Il existe un index pour ces colonnes avec un différent nom!!';
        return;
      }

      const indexKeys = selectedColumns.reduce((acc, column) => {
        acc[column] = 1;
        return acc;
      }, {});

      const selectedOptions = this.options.filter(opt => opt.selected).map(opt => opt.name);

      // Préparation de l'objet à envoyer
      // Construire l'objet IndexCollection
      const indexRequest: IndexCollection = {
        indexKeys: indexKeys, // Utilise les colonnes sélectionnées comme clés d'index
        indexOptions: {
          // Assurez-vous de définir ici les options requises
          unique: selectedOptions.includes('Unique'), // Exemple d'option, adapte cela à tes besoins
          sparse: selectedOptions.includes('Sparse'),
          background: selectedOptions.includes('Background'),
          name: this.indexName,
          expireAfterSeconds: 0,
          version: 2,
          textVersion: 1,
          weights: undefined,
          default_language: '',
          language_override: ''
        },
        columns: selectedColumns // Les colonnes sélectionnées
      };
      //Ajout dans la BD 
      this.store.dispatch(new dbsourceActions.AddNewCollectionIndex({
        dbsourceId: this.data.dbsource,
        databaseName: this.data.dbName,
        containerId: null,
        collectionName: this.data.collName
      }, indexRequest));

      this.collectionIndex.push(indexRequest);

      // Réinitialiser le formulaire
      this.indexName = '';
      
      this.fetchColumns();
      this.fetchOptions();

    }
  }

  private generateColumnKey(columns: string[]): string {
    return columns.sort().join(','); // Trie et joint les colonnes pour créer une clé unique
  }

  getIndexKeysAsString(indexKeys: any): string {
    if (!indexKeys) {
      return '';
    }
    // Récupérer les clés et les joindre par des virgules
    return Object.keys(indexKeys).join(',');
  }

  getTrueOptions(options: any): string {
    return Object.keys(options)
      .filter(key => options[key] === true) // Filtre les clés avec valeur true
      .join(', '); // Joins les clés avec une virgule
  }

  confirmDropCollectionIndex(indexName: string) {
    // Appel de la méthode pour vérifier si la collection est utilisée
    this.confirmModalService.openConfirm(
      'popups.dbsource.collection.dropIndex.title',
      'popups.dbsource.collection.dropIndex.msg',
      { collectionNameIndex: indexName }
    ).afterClosed().subscribe((data) => {
      if (data) {

        this.store.dispatch(new dbsourceActions.DropCollectionIndex({
          dbsourceId: this.data.dbsource,
          databaseName: this.data.dbName,
          containerId: null,
          collectionName: this.data.collName
        }, indexName));

          // Supprimer localement l'index après la suppression
      this.collectionIndex = this.collectionIndex.filter(index => index.indexOptions.name !== indexName);
    
      }
    });
  }
}