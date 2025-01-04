import { Component, ChangeDetectorRef, Input, OnInit, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { AppTranslateService } from '../shared/services/app-translate-service';
import { FunctionState } from '../store/function/function.state';
import { FunctionService } from './function.service';
import { Function } from '../shared/models/Function';
import { environment } from 'src/environments/environment';
import * as functionActions from '../store/function/function.actions';
import { SlideInOutAnimation } from '../shared/animations';
import 'codemirror/mode/javascript/javascript';

import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/selection/active-line.js';
import 'codemirror/addon/hint/javascript-hint';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CloneFunctionModalComponent } from './clone-function-modal/clone-function-modal.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FunctionModalComponent } from './function-modal/function-modal.component';
import { ConfirmModalService } from '../shared/confirm-modal/confirm-modal.service';
import { MatPaginator } from '@angular/material/paginator';





@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.scss'],
  animations: [SlideInOutAnimation],


})
export class FunctionComponent implements OnInit, AfterViewInit {

  @Input() projectId: string;
  @ViewChild('editor') editor: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  nameFilter = new UntypedFormControl('');
  function = new Function();
  selectedIndex = 0;
  toggleFunctionDetails = true;
  baseUrl: string = environment.baseUrl;
  firstContainerId: string;
  nonEmpty: true;
  functions = [];
  selectedFunction;
  isEditMode = false;
  logsUrl: string;
  // mat tab
  columndefs = ['language', 'name', 'version', 'actions'];
  functionFormGroup: UntypedFormGroup;
  // mat sort
  dataSource:any;
  filtreName: string;

  constructor(private toaster: ToastrService, private functionService: FunctionService, private store: Store<FunctionState>, private dialog: MatDialog, private formBuilder: UntypedFormBuilder, private translateService: AppTranslateService, private changeDetectorRefs: ChangeDetectorRef, private confirmModalService: ConfirmModalService) { }

  toggleFunctions = false;



  ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;

  }

  async ngOnInit() {

    this.nameFilter.valueChanges
    .subscribe(
      name => {
        this.filtreName = name;
        this.dataSource.filter = this.filtreName;
      }
    )
    const dialogConfig = new MatDialogConfig();
    this.store.select('functions').subscribe(res => {
      const f = 'functions';
      this.functions = res[f];
      this.functions = [...this.functions];
      this.dataSource = new MatTableDataSource<any>( this.functions);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.logsUrl = window.location.origin + this.logsUrlCreator();
    });
  }
  /** Toggle A Function's viewer */
  logsUrlCreator() {
    return '/runtime/logs/project/' + this.projectId;
  }


  createFilter(): (data: any, filter: string) => boolean {
    const filterFunction = (data, name)=>{
      return data.name.toLowerCase().indexOf(name) !== -1

    }
    return filterFunction;
  }

  copy() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.logsUrl;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toaster.success(this.translateService.getMessage('toaster.resource.copy'));
  }

  showFunctions() {
    this.toggleFunctions = !this.toggleFunctions;
  }

  cloneFunction(f: any, version: string) {
    const clonedFunction = f;
    if (this.functions.filter((d) => { return (d.name === clonedFunction.name && d.version === version) }).length === 0) {
      this.store.dispatch(new functionActions.CloneFunction(version, clonedFunction.version, clonedFunction.name, clonedFunction.projectId));
    } else {
      this.toaster.error(this.translateService.getMessage('toaster.function.notUnique'))
    }
  }

  deleteFunction(f: any) {
    this.store.dispatch(new functionActions.DeleteFunction(f));
  }

  openCloneDialog(f) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.height = '40%';
    dialogConfig.data = {
      name: f.name,
      version: f.version
    };
    const dialogRef = this.dialog.open(CloneFunctionModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => this.cloneFunction(f, data.version)
    );

  }


  openCreateDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100vw';
    dialogConfig.height = '83%';
    dialogConfig.panelClass = 'full-screen-modal';
    dialogConfig.position = {
      top: '80px  '
    };
    dialogConfig.data = {
      editMode: false,
      projectId: this.projectId,
      functions: this.functions
    }
    const dialogRef = this.dialog.open(FunctionModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
    );

  }
  openEditDialog(f) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100vw';
    dialogConfig.height = '83%';
    dialogConfig.panelClass = 'full-screen-modal';
    dialogConfig.position = {
      top: '80px  '
    };
    dialogConfig.data = {
      editMode: true,
      projectId: this.projectId,
      function: f
    }
    const dialogRef = this.dialog.open(FunctionModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe();
    this.changeDetectorRefs.detectChanges();
  }


  public openConfirmDeleteOneDialog(f) {
    const functionIdentifier = f.name + '-' + f.version;
    this.confirmModalService.openConfirm('popups.function.delete.title', 'popups.function.delete.message', { name: functionIdentifier })
      .afterClosed().subscribe(res => {
        if (res) {
          const msg = 'Group Deleted';
          this.deleteFunction(f);
        }
      });
  }
}
