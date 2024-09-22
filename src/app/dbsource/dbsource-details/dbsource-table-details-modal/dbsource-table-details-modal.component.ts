import { Component, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import { ConfirmModalService } from 'src/app/shared/confirm-modal/confirm-modal.service';
import { MessageService } from 'src/app/shared/message-modal/message.service';
import { Column } from 'src/app/shared/models/Column';
import { Constraint } from 'src/app/shared/models/Constraint';
import { DBSource } from 'src/app/shared/models/DBSource';
import { Index } from 'src/app/shared/models/Index';
import { Table } from 'src/app/shared/models/Table';
import { DBSourcesState } from 'src/app/store/dbsource/dbsource.state';
import { DBSourceService } from '../../dbsource.service';
import * as dbsourceActions from '../../../store/dbsource/dbsource.actions';


@Component({
  selector: 'app-dbsource-table-details-modal',
  templateUrl: './dbsource-table-details-modal.component.html',
  styleUrls: ['./dbsource-table-details-modal.component.scss']
})




export class DbsourceTableDetailsModalComponent implements OnInit {
  query: any;
  constraintReady: boolean;
  sqlError = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: UntypedFormBuilder,
    private store: Store<DBSourcesState>,
    public dialogRef: MatDialogRef<DbsourceTableDetailsModalComponent>,
    private messageBoxService: MessageService,
    public dialog: MatDialog) { }
  dbsource: DBSource;
  database: any;
  table: Table;
  tables: Table[];
  columns = [];
  indexes = [];
  indexed = false;
  index = new Index();
  foreignColumns = [];
  constraint = new Constraint();
  constraints = [];
  column = new Column();
  nullableChecked = false;
  autoIncrementChecked = false;
  editModeEnabled = false;
  onDelete = '';
  onUpdate = '';
  mode = '';
  finalQuery = '';
  selectedIndexes: any = [];
  editConstraintProps = ['CASCADE', 'SET NULL', 'NO ACTION', 'RESTRICT']

  displayedColumns: string[] = ['name', 'type', 'category', 'nullable', 'autoIncrement', 'action'];
  dataSchema = {
    name: 'text',
    type: 'text',
    edit: 'edit'
  }
  form: UntypedFormGroup;
  categories = ['PRIMARY KEY', 'INDEX', 'UNIQUE'];
  types = ['INT', 'TEXT', 'BOOLEAN'];
  columnReady = true;

  /** Stepper Component */
  @ViewChild('stepper', { static: false }) stepper: MatStepper;

  ngOnInit(): void {
    this.mode = this.data.mode;
    this.dbsource = this.data.dbsource;
    if (this.data.mode === 'edit') {
      this.table = this.data.table;
      this.columns = this.table.columns;
      this.constraints = this.table.constraints;
      this.indexes = [];
      this.selectedIndexes = [];
    } else {
      this.table = new Table();

    }
  }
  goBack(step : MatStepper){
    step.previous();
  }
  goForward(step : MatStepper){
    step.next();
  }
  checkCategory(column){
    if(this.table.primaryKeys && this.table.primaryKeys.some(el => el===column)){
      return true;
    }
    return false;
  }

  addColumn() {
    this.sqlError = '';
    this.columns.push(this.column);
    this.columnReady = true;
    this.column = new Column();
    this.autoIncrementChecked = false;
    this.nullableChecked = false;
  }

  checkAddColumn(column) {
    return column.name === undefined || column.name === '' || column.type === undefined || column.type === '';
  }
  checkIndex(index) {
    return index.name === undefined || index.name === '' || !this.isColumnsIndexed();
  }
  addIndex() {
    this.columns.forEach(col => {
      if (col.indexed === true) {
        const newIndex = new Index();
        newIndex.name = this.index.name
        newIndex.column = col.name;
        this.indexes.push(newIndex);
        col.indexed = false;
      }
    })
    this.index.name = '';
    this.selectedIndexes = this.groupBy(this.indexes, 'name', 'column');
    this.table.selectedIndexes = this.selectedIndexes;
  }

  groupBy(objectArray, property, value) {
    return objectArray.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      // Add object to list for given key's value
      acc[key].push(obj[value]);
      return acc;
    }, []);
  }

  nextStep(stepper: MatStepper) {
    this.tables = this.dbsource.databases[0].tables.filter(el => el.name !== this.table.name);
    if (stepper.selectedIndex === 1) {
      this.table.columns = this.columns
      this.finalQuery = this.prepareQueryStatement(this.mode, this.table);
    }
    if (stepper.selectedIndex === 2) {
      this.setPrimaryKeysAndIndexes(this.table, this.columns)
      this.finalQuery = this.prepareQueryStatement(this.mode, this.table);

    }
    if (stepper.selectedIndex === 3) {
      this.table.constraints = this.constraints;
      const query = 'Create table';
      this.finalQuery = this.prepareQueryStatement(this.mode, this.table);
    }
  }


  prepareQueryStatement(mode, table: Table) {
    let query = '';
    if (mode === 'create') {
      query += 'Create table `' + table.name + '`( \n';
      table.columns.forEach(column => {
        query += '    `' + column.name + '` ' + column.type + ' ' + this.setNotNullString(column) + ' ' + this.setUniqueString(column)+ ' ' + this.setAutoIncrementString(column) + ', \n'
      })
      if (table.primaryKeys !== undefined) {
        if (table.primaryKeys.length !== 0) {
          query += '    PRIMARY KEY (';
          table.primaryKeys.forEach(key => {
            query += '`' + key + '`,'
          })
          query = query.slice(0, -1);
          query += ') , \n'
        }
      }
      if (table.constraints !== undefined) {
        table.constraints.forEach(constraint => {
          query += '    CONSTRAINT `' + constraint.name + '` FOREIGN KEY (`' + constraint.columnName + '`) REFERENCES `' + constraint.refTable + '` (`' + constraint.refColumn + '`),\n';
        })
      }
      if (table.selectedIndexes !== undefined) {
        const tabResult: any[] = [];
        this.indexes.forEach(index => {
          if (!tabResult.some(el => el.name === index.name)) {
            tabResult.push({ name: index.name, column: '`' + index.column + '`'});
          } else {
            const ind = tabResult.findIndex(t => t.name === index.name);
            tabResult[ind].column += (' , ' + '`' + index.column + '`')

          }
        })
        tabResult.forEach((val) => {
          query += '    INDEX '+ val.name + '(' + val.column + '),\n';
        })
      }
    }
    query = query.trim();

    if (query.charAt(query.length - 1) === ',') {
      query = query.slice(0, -1);
    }

    query += '\n)';
    this.finalQuery = query;
    return query;
  }

  setUniqueString(column: Column) {
    if (column.unique === true) return 'UNIQUE'; else return '';
  }
  setNotNullString(column: Column) {
    if (column.nullable === false) return 'NOT NULL'; else return '';
  }
  setAutoIncrementString(column: Column) {
    if (column.autoIncrement === true) return 'AUTO_INCREMENT'; else return '';
  }

  previousStep(stepper: MatStepper) {

  }

  isColumnsIndexed() {
    return this.columns.filter(el => el.indexed === true).length !== 0 ? true : false;
  }

  isConstraintValid() {
    return this.constraint.name !== undefined && this.constraint.name !== '' && this.constraint.columnName !== undefined && this.constraint.columnName !== '' && this.constraint.refColumn !== undefined && this.constraint.refColumn !== '' && this.constraint.refTable !== undefined && this.constraint.refTable !== '';
  }

  addConstraint() {
    this.sqlError = '';
    this.constraints.push(this.constraint)
    this.constraintReady = true;
    this.constraint = new Constraint();
    this.onUpdate = undefined;
    this.onDelete = undefined;
  }

  openConfirmDeleteDialogColumn(column) {
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
          const index = this.columns.findIndex(el => el.name === column.name);
          this.columns.splice(index, 1);
        }
      });
  }

  openConfirmDeleteDialogConstraint(constraint) {
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
          const index = this.constraints.findIndex(el => el.name === constraint.name);
          this.constraints.splice(index, 1);
        }
      });
  }

  openConfirmDeleteDialogIndex(selectedIndex) {

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
          delete this.selectedIndexes[selectedIndex.key]
          this.indexes.forEach(el => {
            const i = this.indexes.findIndex(ind => ind.name === selectedIndex.key);
            this.indexes.splice(i, 1);
          })
        }
      });

  }


  setAutoIncrement(event, column) {
    this.column.autoIncrement = event;
  }

  setToNull(event) {
    this.column.nullable = event;
  }

  enableEdit(column) {
    column.editModeEnabled = !column.editModeEnabled;
    this.editModeEnabled = !this.editModeEnabled;
  }

  save() {
    this.table.columns = this.columns;
    if (this.stepper.selectedIndex !== 3) {
      this.finalQuery = this.prepareQueryStatement(this.mode, this.table);
    }
    const customQu = { query: '' }
    customQu.query = this.finalQuery;
    this.store.dispatch(new dbsourceActions.AddNewTable({customQuery : customQu , dbsourceId: this.data.dbsource.id, table: this.table , constraints : this.constraints , indexes : this.indexes }));
    this.dialogRef.close();
  }
  changeRefTable(event) {
    const index = this.tables.findIndex(el => el.name === event.value)
    this.foreignColumns = this.tables[index].columns;
  }

  setPrimaryKeysAndIndexes(table: Table, columns: Column[]) {
    table.primaryKeys = columns.filter(col => col.primary === true).map(el => el.name);
    table.indexes = this.indexes;
    table.selectedIndexes = this.selectedIndexes;
  }

}
