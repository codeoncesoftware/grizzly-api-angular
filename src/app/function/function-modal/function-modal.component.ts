import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import 'codemirror/addon/lint/javascript-lint.js'
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/display/autorefresh'

import {JSHINT} from 'jshint';
import { js_beautify } from 'js-beautify';
import { ToastrService } from 'ngx-toastr';
import { FunctionService } from '../function.service';
import { FunctionState } from 'src/app/store/function/function.state';
import { Store } from '@ngrx/store';
import { Function } from 'src/app/shared/models/Function';
import * as functionActions from '../../store/function/function.actions';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { StringChain, truncate } from 'lodash';
import { AWSCredentials } from 'src/app/shared/models/AWSCredentials';
import { OpenFaasInfo } from 'src/app/shared/models/OpenFassInfo';
import { CloneFunctionModalComponent } from '../clone-function-modal/clone-function-modal.component';
import { OpenfaasHeaderModalComponent } from './openfaas-header-modal/openfaas-header-modal.component';

(window as any).JSHINT = JSHINT;





@Component({
  selector: 'app-function-modal', 
  templateUrl: './function-modal.component.html',
  styleUrls: ['./function-modal.component.scss']
})
export class FunctionModalComponent implements OnInit {
  displayedColumns: string[] =  ['Name', 'Type', 'Value','Actions'];
  @ViewChild('codeMirror') private codeEditorCmp: CodemirrorComponent; 
  editCode=false;
  isUnique=true;
  isConfirmed=false;
  function = new Function();
  selectedIndex = 0;
  toggleFunctionDetails = true;
  firstContainerId: string;
  nonEmpty: true;
  functions = [];
  selectedFunction;
  isEditMode = false;
  // mat tab
  columndefs = ['language', 'name', 'version', 'actions'];
  readonly regions=['US_EAST_1','US_EAST_2' , 'US_WEST_1' , 'US_WEST_2' , 'EU_WEST_1', 'EU_WEST_2' ,'EU_WEST_3' , 'EU_CENTRAL_1', 'EU_NORTH_1' , 'EU_SOUTH_1' , 'AP_EAST_1','AP_SOUTH_1','AP_SOUTHEAST_1','AP_SOUTHEAST_2','AP_NORTHEAST_1','AP_NORTHEAST_2','AP_NORTHEAST_3','SA_EAST_1','CN_NORTH_1','CN_NORTHWEST_1','CA_CENTRAL_1','ME_SOUTH_1','AF_SOUTH_1','US_ISO_EAST_1','US_ISOB_EAST_1','US_ISO_WEST_1']
  readonly languages = ['javascript' , 'AWS Lambda' , 'OpenFaas'];
    // codemirror editor
  options = {
    extraKeys: { 'Ctrl-Space': 'autocomplete', 'Shift-Tab': 'autoFormatSelection' },
    autofocus: true,
    mode: 'javascript',
    theme: 'default',
    lineWrapping: true,
    fixedGutter: true,
    findNext: true,
    findPrevious: true,
    lineWiseCopyCut: true,
    matchBrackets: true,
    indentUnit: 4,
    indentWithTabs: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    smartIndent: true,
    dragDrop: true,
    lineSeparator: '\n',
    closeBrackets: true,
    lineNumbers: true,
    foldGutter: true,
    autoRefresh:true,
    showAutoCompleteButton: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    lint:false

  };
  editorOptions = { theme: 'vs-dark', language: 'javascript' };
  codeJs = '// example javascript input function\n(request)=>{\n     return request.body;\n}\n';
  codeJava = '// example code java\n'
    + 'import java.util.*;\n'
    + 'public class Example {\n'
    + '  public Object productValidator(Request event) {\n'
    + '    return event.getBody();\n'
    + '  }\n '
    + '}';
  // add && update function
  selectedLanguage = '';
  functionName = '';
  functionVersion :string;
  functionToSave = '';
  modelToSave = '';
  modelName = '';
  className = '';
  methodName = '';
  functionToPass = this.codeJs;
  activeFunction;
  // mat stepper
  functionFormGroup: UntypedFormGroup;
  secondFormGroup: UntypedFormGroup;
  languageFormGroup: UntypedFormGroup;
  form: UntypedFormGroup;
  version: string;
  name: string;
  // aws
  awsKeyId: string;
  awsSecretKey: string;
  awsSessionToken: string;
  awsRegion: string;
  awsFunctionName: string;
  awsCredentials: AWSCredentials;
  // Openfaas
  openFaasHost: string;
  openFaasPort: string;
  openFaasHeaders: string[];
  openFaasURI: string;
  parameters:any[]=[];



  constructor( private changeDetectorRefs: ChangeDetectorRef,private translateService: AppTranslateService, private dialog: MatDialog, private fb: UntypedFormBuilder, private toaster: ToastrService, private functionService: FunctionService, private store: Store<FunctionState>, private formBuilder: UntypedFormBuilder, public dialogRefFunction: MatDialogRef<FunctionModalComponent>, @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit(): void {
    const dialogConfig = new MatDialogConfig();
    const FUNCTION_NAME_PATTERN = /[0-9\+\-\ ]/;
    setTimeout(() => this.codeEditorCmp.codeMirror.refresh(), 250);
    this.functionFormGroup = this.formBuilder.group({
      firstCtrl: [Function, Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.languageFormGroup = this.formBuilder.group({
      languageCtrl: ['', Validators.required],
      awsRegionCtrl:'US_EAST_1'
    });
    this.isEditMode = this.data.editMode;
    if (this.data.function) {
      this.selectFunction(this.data.function)
    }
    if(!this.data.editMode){
      this.editCode=true;
      this.functionVersion='1.0.0';
    }
  }



  changeLanguage(e) {


    if (this.isEditMode === false) {
      switch (e.value) {
        case 'javascript': {
          this.functionToPass = this.codeJs;
          this.options.mode = e.value;
          break;
        }
        case 'java': {
          this.functionToPass = this.codeJava;
          this.options.mode = 'text/x-java';
          break;
        }
      }
    } else {
      switch (e.value) {
        case 'javascript': {
          this.options.mode = e.value;
          break;
        }
        case 'java': {
          this.options.mode = 'text/x-java';
          break;
        }
      }
    }
  }

  beautifyJs(): void {
    if (this.languageFormGroup.get('languageCtrl').value === 'javascript') {
      this.functionToPass = js_beautify(this.functionToPass);
    } else if (this.languageFormGroup.get('languageCtrl').value === 'java') {
      this.functionToPass = js_beautify(this.functionToPass);
    }
  }

  addFunction() {
    this.isEditMode = false;
    this.activeFunction = new Function();
    this.functionFormGroup.setValue({ firstCtrl: new Function() });
    this.languageFormGroup.setValue({ languageCtrl: '' });
    this.functionName = '';
    this.functionVersion = '';
    this.functionToPass = '';
    this.modelToSave = '// example of java model\n'
      + 'public class Product {\n'
      + '  private int price;\n'
      + '  private String _id;\n'
      + '  public int getPrice() {\n   '
      + '    return this.price;\n   '
      + '    };\n'
      + '  public void setPrice(int p) {\n'
      + '       this.price=p;\n'
      + '    };\n'
      + '  public String get_id() {\n '
      + '   return this._id;\n'
      + '     };\n'
      + ' public void set_id(String id) {\n'
      + '         this._id=id;\n'
      + '     }\n'
      + ' }';
  }

  createFunction() {
     this.isUnique=true;
    if (!this.languageFormGroup.get('languageCtrl').errors && this.functionName.length >= 1 && this.functionVersion.length >= 1) {


      if (this.data.functions.filter(f => f.name === this.functionName && f.version === this.functionVersion).length === 0) {

        const functionTosave = new Function();
        functionTosave.projectId = this.data.projectId;
        functionTosave.language = this.languageFormGroup.get('languageCtrl').value;
        functionTosave.name = this.functionName;
        functionTosave.version = this.functionVersion;

        if(functionTosave.language==='OpenFaas'){
          functionTosave.openFaasURI = this.openFaasURI;
          if(!functionTosave.openFaasURI ){
            this.isConfirmed=true;
            return;
          }
        }


        if( functionTosave.language ==='AWS Lambda'){
          const awsCredentials= new AWSCredentials();
          awsCredentials.awsAccessKeyId=this.awsKeyId;
          awsCredentials.awsSecretAccess=this.awsSecretKey;
          awsCredentials.awsSessionToken=this.awsSessionToken;
          awsCredentials.region=this.languageFormGroup.get('awsRegionCtrl').value;
          functionTosave.awsFunctionName=this.awsFunctionName;
          functionTosave.awsCredentials=awsCredentials;
          if(!awsCredentials.awsAccessKeyId || !awsCredentials.awsSecretAccess  || !awsCredentials.region ){
            this.isConfirmed=true;
            return;
          }
        }
        else {
          functionTosave.function = this.functionToPass;
          if (functionTosave.language === 'java') {
            if (this.className != null && this.className.length >= 1 && this.methodName != null && this.methodName.length >= 1 && this.modelName != null && this.modelName.length >= 1 && this.modelToSave != null && this.modelToSave.length >= 1) {
              functionTosave.className = this.className;
              functionTosave.methodName = this.methodName;
              functionTosave.modelName = this.modelName;
              functionTosave.model = this.modelToSave;
            } else {
              this.toaster.error(this.translateService.getMessage('toaster.function.null'));
              return;
            }
          }
        }
        this.store.dispatch(new functionActions.CreateFunction(functionTosave));
        this.dialogRefFunction.close();


      } else {
      this.isUnique=false;
      this.isConfirmed=false;
      }

    } else {
      this.isConfirmed=true;
      this.isUnique=true;

    }

  }

  selectFunction(selectedFunction) {
    this.activeFunction = selectedFunction
    this.functionFormGroup.setValue({ firstCtrl: this.activeFunction });
    this.functionToPass = this.activeFunction.function;
    this.languageFormGroup.setValue({ languageCtrl: this.activeFunction.language,awsRegionCtrl: 'none' });
    this.functionName = this.activeFunction.name;
    this.methodName = this.activeFunction.methodName;
    this.modelName = this.activeFunction.modelName;
    this.modelToSave = this.activeFunction.model;
    this.className = this.activeFunction.className;
    this.functionVersion = this.activeFunction.version;
    if(this.activeFunction.language==='OpenFaas'){
      this.openFaasURI = this.activeFunction.openFaasURI;
    }
    if(this.activeFunction.language==='AWS Lambda'){
      this.awsCredentials= this.activeFunction.awsCredentials;
      this.languageFormGroup.setValue({ languageCtrl: this.activeFunction.language,awsRegionCtrl: this.awsCredentials.region });
      this.awsKeyId=this.awsCredentials.awsAccessKeyId;
      this.awsSecretKey=this.awsCredentials.awsSecretAccess;
      this.awsRegion=this.awsCredentials.region;
      this.awsSessionToken=this.awsCredentials.awsSessionToken;
      this.awsFunctionName=this.activeFunction.awsFunctionName;

    }

  }

  newFunction() {
    this.activeFunction = new Function();
    this.functionFormGroup.setValue({ firstCtrl: new Function() });
    this.isEditMode = false;
  }

  updateFunction() {
    if (this.functionName.length >= 1 && this.functionVersion.length >= 1) {
      const functionTosave = new Function();
      functionTosave.projectId = this.data.projectId;
      functionTosave.function = this.functionToPass;
      functionTosave.language = this.languageFormGroup.get('languageCtrl').value;

      if(functionTosave.language==='OpenFaas'){
        const openFaasInfo=new OpenFaasInfo();
        openFaasInfo.uri=this.openFaasURI;
        openFaasInfo.headers=this.parameters;
        functionTosave.openFaasInfo=openFaasInfo;
        if(!openFaasInfo.uri   ){
          this.isConfirmed=true;
          return;
        }
      }



      if (functionTosave.language === 'AWS Lambda') {
        this.awsCredentials=new AWSCredentials();
        this.awsCredentials.awsAccessKeyId=this.awsKeyId;
        this.awsCredentials.awsSecretAccess=this.awsSecretKey;
        this.awsCredentials.awsSessionToken=this.awsSessionToken;
        this.awsCredentials.region=this.languageFormGroup.get('awsRegionCtrl').value;
        functionTosave.awsCredentials=this.awsCredentials;
        functionTosave.awsFunctionName=this.awsFunctionName;
        if(!this.awsCredentials.awsAccessKeyId || !this.awsCredentials.awsSecretAccess  || !this.awsCredentials.region ){
          this.isConfirmed=true;
          return;
        }
      }

      if (functionTosave.language === 'java') {
        if (this.className != null && this.className.length >= 1 && this.methodName != null && this.methodName.length >= 1 && this.modelName != null && this.modelName.length >= 1 && this.modelToSave != null && this.modelToSave.length >= 1) {
          functionTosave.className = this.className;
          functionTosave.methodName = this.methodName;
          functionTosave.modelName = this.modelName;
          functionTosave.model = this.modelToSave;
        } else {
          this.translateService.getMessage('toaster.function.null');
          return;
        }
      }
      functionTosave.name = this.functionName;
      functionTosave.version = this.functionVersion;
      this.store.dispatch(new functionActions.UpdateFunction(this.data.projectId, this.activeFunction.name, this.activeFunction.version, functionTosave));
      this.dialogRefFunction.close(functionTosave);

    } else {
      this.isConfirmed=true;
      this.isUnique=true;
    }

  }
  editCodeFunction() {
    this.editCode = true;
  }

  openPramsModal(){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '70%';
    dialogConfig.height = '40%';
    dialogConfig.data = {
      isEditMode:false
    }


    const dialogRef = this.dialog.open(OpenfaasHeaderModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data =>{ this.parameters.push(data.parameter); const newParameters=[...this.parameters]; this.parameters=newParameters;this.changeDetectorRefs.detectChanges(); }
    );
  }
  deleteHeader(i){
    this.parameters.splice(i, 1);
    this.parameters=[...this.parameters];
  }

  editHeader(i){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '70%';
    dialogConfig.height = '40%';
    dialogConfig.data = {
      header:this.parameters[i],
      isEditMode:true
    }

    const dialogRef = this.dialog.open(OpenfaasHeaderModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data =>{ this.parameters[i]=data.parameter; const newParameters=[...this.parameters]; this.parameters=newParameters;this.changeDetectorRefs.detectChanges(); }
    );
  }




}
