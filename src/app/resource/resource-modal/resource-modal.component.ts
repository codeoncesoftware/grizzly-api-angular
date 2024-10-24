import { Component, OnInit, Inject, ViewChild, ElementRef, Input, ChangeDetectorRef, ChangeDetectionStrategy, Output } from '@angular/core';
import { Resource } from 'src/app/shared/models/Resource';
import { ParameterType } from 'src/app/shared/resource-types';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Parameter } from 'src/app/shared/models/Parameter';
import { COMMA, ENTER, F, LEFT_ARROW } from '@angular/cdk/keycodes';

// NG2 UPLOADER IMPORTS
import { FileUploader } from 'ng2-file-upload';
import { Store } from '@ngrx/store';
import * as containerActions from '../../store/container/container.actions';
import * as dbsourceActions from '../../store/dbsource/dbsource.actions';
import { ContainerState } from 'src/app/store/container/container.state';
import { ResourceGroup } from 'src/app/shared/models/ResourceGroup';
import { Container } from 'src/app/shared/models/Container';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FileExplorerComponent } from 'src/app/container/file-explorer/file-explorer.component';
import { APIResponse } from 'src/app/shared/models/APIResponse';
import { DBSourcesState } from 'src/app/store/dbsource/dbsource.state';
import { DBSource } from 'src/app/shared/models/DBSource';
import { Database } from 'src/app/shared/models/Database';

import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { ProjectsState } from 'src/app/store/project/project.state';
import { Project } from 'src/app/shared/models/Project';
import { SelectFilesModalService } from './select-files-modal/select-files-modal.service';
import { ResourceFile } from 'src/app/shared/models/ResourceFile';
import { CustomQuery } from 'src/app/shared/models/CustomQuery';
import { FileNode } from 'src/app/shared/models/FileNode';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { MessageService } from 'src/app/shared/message-modal/message.service';
import { HighlightResult } from 'ngx-highlightjs';
import { ToastrService } from 'ngx-toastr';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { ParamsModalComponent } from '../params-modal/params-modal.component';
import { CodesModalComponent } from '../codes-modal/codes-modal.component';
import { DBSourceService } from 'src/app/dbsource/dbsource.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FunctionState } from 'src/app/store/function/function.state';
import { FunctionService } from 'src/app/function/function.service';
import { ResourceLog } from 'src/app/shared/models/ResourceLog';
import { FunctionModalComponent } from 'src/app/function/function-modal/function-modal.component';
import { DataService } from 'src/app/shared/services/data/data.service';

/**
 * IMPORTANT !!
 *
 * This Component needs to be Refactored into multiple Components
 * For Each Operation, one single Component
 * XSL, Thymeleaf, FreeMarker, Query, File and The Parent Component
 */

@Component({
  selector: 'app-resource-modal',
  templateUrl: './resource-modal.component.html',
  styleUrls: ['./resource-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class ResourceModalComponent implements OnInit {


  // JSON EDITOR
  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;
  /** File Explorer Component */
  @ViewChild('prem', { static: false }) fileExplorer: FileExplorerComponent;
  @ViewChild('sec', { static: false }) sec: FileExplorerComponent;
  /** Stepper Component */
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  /** New Collection Name Input */
  @ViewChild('newCollection', { static: false }) newCollectionInput: ElementRef;
  @ViewChild('editor') codeMirrorEditor: any;



  /** Wizard Step by Step Variables */
  noResources = false; // To prevent skiping a step
  public Editor = ClassicEditor;
  firstFormGroup: UntypedFormGroup;
  secondFormGroup: UntypedFormGroup;
  thirdFormGroup: UntypedFormGroup;
  /** Select File ID */
  selectedFileId = '';
  selectedFileName = '';
  selected = false;
  bodyExists: boolean;
  selectedParamType = 'string';
  @Output()
  emptyCollection = false;
  selectedFileSecId = '';
  selectedFileSecName = '';
  selectedSec = false;
  /** Switch Edit Mode */
  editMode = false;
  queryGenerated = false;
  /** disable Default Value Input On File Type Select */
  disableDefaultValue = false;
  queryType = this.data.resource.customQuery.type;
  updateModal = false;

  types = ParameterType;
  param = new Parameter();
  response = new APIResponse();
  responses = [] as APIResponse[];
  consumes = [] as string[];
  produces = [] as string[];
  parameters = [] as Parameter[];
  requestBody = new Parameter();
  bodyContent: string;
  resource: Resource;
  notUnique = false;
  progress = 0;
  containerToSave: Container = new Container();
  activecontainer: Container;
  primaryFiles: string[] = [];
  secondaryFiles: any[] = [];
  showModal = true;
  apiUnicity = true;
  emptyPath = false;
  /** NG2 UPLOADER */
  public uploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver = false;
  // functions
  public outFunctions = [];
  public inFunctions = [];
  public functions = [];
  public allFunctions = [];
  dropTable = [];
  public outFunction;
  public inFunction;
  public function;
  public showOutFunction = false;
  public showInFunction = false;
  public showFunction = false;
  isConfirmed = false;



  // Chips Variables
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  /** Dbsources Section */
  dbsourcesList: DBSource[] = [];
  databasesList: Database[] = [];
  collectionsList: string[] = [];
  query: any;
  updateQuery: any;

  /** Add New Collection */
  newCollectionName: string;
  oldcollectionName: string;
  addCollectionBool = false;
  differentModel = false;

  /** Active Project */
  project = new Project();

  /** This variable is for XML Content Upload */
  xmlFile: any;

  /** Name For File To Upload In Case Of FIle Handling */
  fileNameForUpload: string;

  /** Array to Share Data Between search-file Component and upload-fie-component */
  searchSelectedFiles: FileNode[] = [];
  showTree = false;
  showSelectBtn = false;
  Rgroup: ResourceGroup;
  // Snippets Names
  querySnippetNames = [];


  provider: string;
  type: string;
  ourResp: HighlightResult;

  requestModel = `
  // desciption of your model
  class User {
    // username description
    username : string; // example : john@example.com
    /* password description */
    password : string;
    enabled : boolean;
    age : number;
  }`;
  responseModel = `
  // desciption of your model
  class User {
    // username description
    username : string; // example : john@example.com
    /* password description */
    password : string;
    enabled : boolean;
    age : number;
  }`;
  showResponseEditor = false;
  showRequestEditor = false;
  endpointModels = [];
  reqModel = null;
  respModel = null;
  editorMode = false;
  paramsInfos: string;
  responseModelError = false;
  requestModelError = false;
  Snippets = [
    { name: 'findByFirstname', snippet: '{"firstName": "$session_firstname"}' },
    { name: 'findByLastname', snippet: '{"lastName": "$session_lastname"}' },
    { name: 'findByCurrentUserUsername', snippet: '{"email": "$session_email"}' },
    { name: 'findByCurrentUserEmail', snippet: '{"email": "$session_email"}' },
    { name: 'findByCurrentUserPhone', snippet: '{"username": "$session_phone"}' }
  ];

  mode: string;
  forwardResponseModel: string = null;
  forwardRequestModel: string = null;
  public requestUploader: FileUploader = new FileUploader({});
  public responseUploader: FileUploader = new FileUploader({});
  responseMode = '';
  requestMode = '';
  resourceLog = new ResourceLog();
  lastEndpointModel = {};
  newEndpointModel = {};
  modelsLength = 0;
  isFunctionEmpty = false;
  searchTxt: string;
  searchTxtIn: string;
  searchTxtOut: string;
  emptySqlQuery = true;
  showTables = false;
  reqTable = false;
  respTable = false;
  showRespTables = false;
  functionsTab = [];
  showOpenFaasPostWarning = false;
  constructor(private dataService: DataService, private ref: ChangeDetectorRef, private functionStore: Store<FunctionState>, private functionService: FunctionService, private containersStore: Store<ContainerState>, private dbsourcesStore: Store<DBSourcesState>, private projectStore: Store<ProjectsState>, private formBuilder: UntypedFormBuilder, public dialog: MatDialog, public resourceDialogRef: MatDialogRef<ResourceModalComponent>, public selectFilesModalService: SelectFilesModalService, public messageBoxService: MessageService, public dbSourceService: DBSourceService, @Inject(MAT_DIALOG_DATA) public data: any, private toaster: ToastrService, private translateService: AppTranslateService) {

    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mainMenuBar = false;
  }

  getSnippetNames(snippets) {
    snippets.forEach(el => {
      this.querySnippetNames.push(el.name);
    });
  }
  onChangeSelect(t) {
    let q = '';
    const params = this.resource.parameters.filter(element => ((element.in.toLowerCase() === 'query' || element.in.toLowerCase() === 'path') && (element.name !== 'pageNumber' && element.name !== 'pageSize')));

    if (params.length === 1) {
      if (params[0].name === 'id') {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        if (t['value'] === 'aggregation') {
          q = '{"$match":{"_id":"%id"}}, "$group":{"_id":"%id","sum":{"$sum":"$id"}}}';
        } else {
          q = '{"_id":"%id"}';
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/dot-notation
        if (t['value'] === 'aggregation') {
          q = '{"$match":{"' + params[0].name + '":"%' + params[0].name + '"}, "$group":{"_id":"%' + params[0].name + '","sum":{"$sum":"$' + params[0].name + '"}}}';
        } else {
          q = '{"' + params[0].name + '":"%' + params[0].name + '"}';
        }
      }
    } else {
      params.forEach(el => {
        if (el.name === 'id') {
          // eslint-disable-next-line @typescript-eslint/dot-notation
          if (t['value'] === 'aggregation') {
            q = '{"$match":{"_id":"%id"}}, "$group":{"_id":"%id","sum":{"$sum":"$id"}}}';
          } else {
            q = '{"_id":"%id"}';
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/dot-notation
          if (t['value'] === 'aggregation') {
            q = '{"$match":{"' + el.name + '":"%' + el.name + '"}, "$group":{"_id":"%' + el.name + '","sum":{"$sum":"$' + el.name + '"}}}';
          } else {
            q = '{"' + el.name + '":"%' + el.name + '"}';
          }
        }
      });
    }
    // eslint-disable-next-line @typescript-eslint/dot-notation
    if (t['value'] === 'executeQuery') {
      this.querySnippetNames = [];
      this.generateQuery(this.resource.parameters);
    }
    // eslint-disable-next-line @typescript-eslint/dot-notation
    if (t['value'] === 'count') {
      this.querySnippetNames = [];
      this.Snippets.unshift({ name: 'countBy' + params[0].name.replace(/\b\w/g, l => l.toUpperCase()), snippet: q });
      this.querySnippetNames.unshift('countBy' + params[0].name.replace(/\b\w/g, l => l.toUpperCase()));
    }
    // eslint-disable-next-line @typescript-eslint/dot-notation
    if (t['value'] === 'aggregation') {
      this.querySnippetNames = [];
      this.Snippets.unshift({ name: 'SumBy' + params[0].name.replace(/\b\w/g, l => l.toUpperCase()), snippet: q });
      this.querySnippetNames.unshift('SumBy' + params[0].name.replace(/\b\w/g, l => l.toUpperCase()));

    }
  }
  ngOnInit() {
    //setTimeout(() => this.codeMirrorEditor.codeMirror.refresh(), 250);
    this.functionStore.select('functions').subscribe((d) => {
      const functonsString = 'functions';
      this.functionsTab = d[functonsString];
      if (this.data.resource.outFunctions) {
        const o = d[functonsString].filter(((x) => x.id === this.data.resource.outFunctions[0]));
        if (o.length === 1) {
          this.outFunction = o[0];
        }
      }
      if (this.data.resource.inFunctions) {
        const i = d[functonsString].filter(x => x.id === this.data.resource.inFunctions[0]);
        if (i.length === 1) {
          this.inFunction = i[0];
        }
      }
      if (this.data.resource.functions) {
        const i = d[functonsString].filter(x => x.id === this.data.resource.functions[0]);
        if (i.length === 1) {
          this.function = i[0];
        }
      }
    });


    if (this.data.editMode) {
      this.editMode = this.data.editMode ? true : false;
    }
    this.editorMode = this.data.editorMode ? true : false;
    this.paramsInfos = this.data.editorMode ? this.translateService.getMessage('help.addParamEditor') : this.translateService.getMessage('help.addParam');
    this.containerToSave = JSON.parse(JSON.stringify(this.data.container));

    if (this.data.resource.path !== '/') {
      this.updateModal = true;
    }

    const f = 'functions';
    this.functionStore.select('functions').subscribe((data) => this.allFunctions = data[f]);
    // this.getSnippetNames(this.Snippets);
    this.showRequestEditor = false;
    this.showResponseEditor = false;
    /** Declaration of Listeners for The State Change Starts */
    this.containersStore.select('containers').subscribe(res => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      if (!res['active'].hierarchy) {
        this.noResources = true;
      }
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.activecontainer = res['active'];
      this.lastEndpointModel = this.activecontainer.endpointModels[this.activecontainer.endpointModels.length - 1];
      this.modelsLength = this.activecontainer.endpointModels.length

      this.Rgroup = this.data.Rgroup;
      // Create a default ResourceGroup if no RG exists or place the new API in the last RG
      if (!this.Rgroup) {
        if (this.activecontainer.resourceGroups.length === 1 && (this.activecontainer.resourceGroups[0].name === 'Authentication Grizzly' || this.activecontainer.resourceGroups[0].name === 'Authentication Oauth')) {
          this.Rgroup = new ResourceGroup('Untitled');
          this.activecontainer.resourceGroups.push(this.Rgroup);
        } else {
          this.Rgroup = this.activecontainer.resourceGroups[this.activecontainer.resourceGroups.length - 1];
        }
      }
    });


    this.dbsourcesStore.select('dbsources').subscribe(res => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.dbsourcesList = res['dbsources'];

      if (this.resource && this.resource.customQuery && this.resource.customQuery.database) {
        // Seletec Databases List for Each Data Source
        this.getDatabases(this.resource.customQuery.datasource);
      }


    });
    this.projectStore.select('projects').subscribe(resState => {

      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.project = resState['active'];
    });
    /** Declaration of Listeners for The State Change Ends */
    // INITIATE Resource Object
    this.resource = { ...this.data.resource };
    if (this.resource.openAPIResponses.length > 0) {
      this.resource.responses = this.convertOpenAPIResponseToOpenResponse(this.resource.openAPIResponses, this.resource);

    }
    if (!this.editMode) {
      this.resource.customQuery.queryName = 'executeQuery';
    }
    if (this.data.project) {
      this.resource.customQuery.datasource = this.data.project.dbsourceId;
      this.resource.customQuery.database = this.data.project.databaseName;
    }
    if (this.resource.customQuery) {
      this.resource.customQuery.datasource = this.project.dbsourceId;
      this.resource.customQuery.database = this.project.databaseName;
    } else {
      if (this.resource.customQuery) {
        this.resource.customQuery.datasource = this.project.dbsourceId;
        this.resource.customQuery.database = this.project.databaseName;
      } else {
        this.resource.customQuery = new CustomQuery();
        this.resource.customQuery.datasource = this.project.dbsourceId;
        this.resource.customQuery.database = this.project.databaseName;
      }


    }

    /** Get Collections List */
    this.selectCollections();

    /** Get Provider */
    this.provider = this.getLinkedDBProvider();
    this.type = this.getLinkedDBType();

    if (!this.resource.executionType) {
      this.resource.executionType = 'Query';
    }

    if (this.resource.executionType === 'File' && this.resource.parameters[0]) {
      this.fileNameForUpload = this.resource.parameters[0].name;
    }

    if (this.type !== 'sql') {
      if (this.resource.customQuery.query) {
        this.query = JSON.parse(this.resource.customQuery.query);
      } else {
        this.query = JSON.parse('{}');
      }
      this.editorOptions.mode = 'code';
      this.editorOptions.modes = ['code']; // set all allowed modes
    } else {
      this.query = this.resource.customQuery.query;
      this.editorOptions.mode = 'text';
      this.editorOptions.modes = ['code']; // set all allowed modes
    }


    if (this.data.resource.resourceFile && this.data.resource.resourceFile.fileUri) {
      this.editMode = true;
      this.selectedFileId = this.resource.resourceFile.fileId;
      this.selectedFileName = this.resource.resourceFile.fileUri;
      this.secondaryFiles = this.resource.secondaryFilePaths;
    }


    if (this.resource.parameters) {
      this.parameters = this.resource.parameters;
    } else {
      this.parameters = [];
      if (this.resource.httpMethod === 'POST' || this.resource.httpMethod === 'PUT' || this.resource.httpMethod === 'PATCH') {
        const parameter = new Parameter();
        parameter.name = 'body';
        parameter.in = 'Body';
        parameter.type = 'object';
        parameter.description = 'This is your body parameter';
        parameter.required = true;
        if (!this.parameters.some(el => el.in === 'Body')) {
          this.parameters.push(parameter);
        }
      } else {
        const index = this.parameters.findIndex(el => el.in === 'Body');
        if (index >= 0) {
          this.parameters.splice(index, 1);
        }
      }
    }
    if (this.resource.customQuery) {
      // If a Data Source is already Selected, Load Databases List
      if (this.resource.customQuery.datasource) {
        this.getDatabases(this.resource.customQuery.datasource);
      }
      // If a Database is already selected, Load Collections List
      if (this.resource.customQuery.database) {
        this.getCollections(this.resource.customQuery.database);

      }
    }


    if (this.resource.httpMethod === 'GET' && this.resource.customQuery.type !== 'Execute') {
      this.resource.customQuery.type = 'Read';
    }

    /** Reactive Form Fields */
    this.secondFormGroup = this.formBuilder.group({
      resourceName: [''],
      pathName: ['', Validators.required],
      httpMethod: ['', Validators.required],
      resourceDescription: [''],
      paramValue: [''],
      resourceSummary: [''],
      executionType: [''],
      datasource: [''],
      collection: [''],
      newCollection: [''],
      database: [''],
      queryType: [''],
      fileNameForUpload: [''],
      newCollectionName: [''],
      many: [''],
      requestMany: ['']
    });

    this.firstFormGroup = this.formBuilder.group({
      resourceName: [''],
      pathName: ['', Validators.required],
      httpMethod: ['', Validators.required],
      resourceDescription: [''],
      paramValue: [''],
      resourceSummary: [''],
      executionType: [''],
      datasource: [''],
      collection: [''],
      newCollection: [''],
      database: [''],
      queryType: [''],
      fileNameForUpload: [''],
      newCollectionName: [''],
      many: [''],
      requestMany: ['']
    });

    this.thirdFormGroup = this.formBuilder.group({
      resourceName: [''],
      pathName: ['', Validators.required],
      httpMethod: ['', Validators.required],
      resourceDescription: [''],
      paramValue: [''],
      resourceSummary: [''],
      executionType: [''],
      datasource: [''],
      function: [''],
      queryType: [''],
      many: [''],
      requestMany: ['']
    });
    this.parameters.forEach(element => {
      if (element.in === 'Body' && element.value) {
        this.bodyExists = true;
      }
    });

    this.selectFilesModalService.selectedFile.subscribe((res: any) => {
      if (res) {
        let resourceFile;
        // Initiate ResourceFile To Save
        if (res.file.name.lastIndexOf(this.activecontainer.id) > -1) {
          resourceFile = new ResourceFile(res.file.fileId, res.file.name.substr(res.file.name.lastIndexOf(this.activecontainer.id) + this.activecontainer.id.length + 1, res.length).split('\\').join('/'));
        } else {
          resourceFile = new ResourceFile(res.file.fileId, res.file.name);
        }
        if (res.mode === 'primary') {
          this.resource.resourceFile = resourceFile;
        } else {
          if (this.resource.secondaryFilePaths.findIndex(file => file.fileId === resourceFile.fileId) < 0) {
            this.resource.secondaryFilePaths.push(resourceFile);
          }
        }
      }
    });
    if (this.data.editMode) {
      const bodyModelIndex = this.resource.parameters.findIndex(el => el.modelName !== '' && el.modelName !== null && el.in.toLowerCase() === 'body');
      this.reqModel = this.resource.parameters[bodyModelIndex] === undefined ? null : this.resource.parameters[bodyModelIndex].modelName;
      this.forwardRequestModel = this.reqModel;
      this.resource.responses = this.resource.responses.sort((a, b) => (a.code > b.code) ? 1 : -1);
      if (this.resource.responses[0] !== undefined) {
        if (this.resource.responses[0].schema !== null && this.resource.responses[0].schema) {
          this.respModel = this.resource.responses[0].schema.ref !== '' ? this.resource.responses[0].schema.ref : null;
          this.forwardResponseModel = this.respModel;
        } else {
          this.respModel = null;
          this.forwardResponseModel = this.respModel;
        }


      } else {
        this.respModel = null;
        this.forwardRequestModel = this.reqModel;
      }
    }



  }

  toggleResponseEditor() {
    this.showResponseEditor = !this.showResponseEditor;
    this.responseModelError = false;
    if (this.showResponseEditor) {
      this.mode = 'add';
      this.responseMode = 'add';
      this.responseModel = `
      // desciption of your model
      class User {
        // username description
        username : string; // example : john@example.com
        /* password description */
        password : string;
        enabled : boolean;
        age : number;
      }`;
    }
  }
  toggleRequestEditor() {
    this.showRequestEditor = !this.showRequestEditor;
    this.requestModelError = false;
    if (this.showRequestEditor) {
      this.mode = 'add';
      this.requestMode = 'add';
      this.requestModel = `
      // desciption of your model
      class User {
        // username description
        username : string; // example : john@example.com
        /* password description */
        password : string;
        enabled : boolean;
        age : number;
      }`;
    }
  }

  deleteOutFunction(i) {
    this.outFunctions.filter(f => f.id !== this.outFunctions[i].id);
    this.resource.outFunctions = this.outFunctions.map(f => f.id);
  }
  deleteInFunction(i) {
    this.inFunctions.filter(f => f.id !== this.inFunctions[i].id);
    this.resource.inFunctions = this.inFunctions.map(f => f.id);
  }
  drop(event: CdkDragDrop<string[]>) {

    if (event.container.id === 'dropFunctions' && event.previousContainer !== event.container) {
      if (event.previousContainer.id === 'inputFunctions') {
        this.inFunctions.splice(event.previousIndex, 1);
      } else if (event.previousContainer.id === 'outputFunctions') {
        this.outFunctions.splice(event.previousIndex, 1);
      }
    }
  }

  /** ADD Param to the list of parameters */
  public addNewParam() {
    if (this.param.name && this.param.type && this.param.in && this.getParamIndex(this.param) < 0) {
      if (this.param.type.toLowerCase() === 'file') {
        if (!this.resource.consumes.find(str => str === 'multipart/form-data')) {
          this.resource.consumes.push('multipart/form-data');
        }
      }
      this.parameters.push(this.param);
      this.param = new Parameter();
    }
  }
  getHeadersFromResponse(headers?) {
    if (headers) {
      return Object.keys(headers).join(', ');
    }
  }
  /**  DELETE Param on Click Before Upload */
  public deleteParam(i: number) {
    if (this.parameters[i].in === 'Body') {
      this.bodyExists = false;
    }

    this.parameters.splice(i, 1);
  }

  /** ADD New Reponse Code & Description */
  public addNewResponse() {
    this.dialog.open(CodesModalComponent,
      {
        width: '80%',
        position: {
          top: '5vh'
        },
        data: {
          responses: this.resource.responses,
          container: this.containerToSave
        }
      }).afterClosed().subscribe(res => {
        if (res) {
          this.ref.detectChanges();
          this.resource.responses = res.responses;
          const resources = this.resource.responses.filter(el => Number(el.code) > 199 && Number(el.code) < 300);
          if (resources.length > 0) {
            const resource = resources[0];
            if (resource.schema !== null) {
              if (resource.schema.ref !== '' && resource.schema.ref !== null && resource.schema.ref !== undefined) {
                this.forwardResponseModel = resource.schema.ref;
                this.respModel = resource.schema.ref;
              }
            }
          }
          this.endpointModels = res.container.endpointModels;
        }

      });
  }
  editResponse(item) {
    this.dialog.open(CodesModalComponent,
      {
        width: '80%',
        position: {
          top: '5vh'
        },
        data: {
          response: item,
          responses: this.resource.responses,
          container: this.containerToSave
        }
      }).afterClosed().subscribe(res => {
        if (res) {
          this.ref.detectChanges();
          this.resource.responses = res.responses;
          const resources = this.resource.responses.filter(el => Number(el.code) > 199 && Number(el.code) < 300);
          if (resources.length > 0) {
            const resource = resources[0];
            if (resource.schema !== null) {
              if (resource.schema.ref !== '' && resource.schema.ref !== null && resource.schema.ref !== undefined) {
                this.forwardResponseModel = resource.schema.ref;
                this.respModel = resource.schema.ref;
              }
            }
          }
          this.endpointModels = res.container.endpointModels;
        }

      });
  }
  /** DELETE Response on Click */
  public deleteResponse(i: number) {
    this.resource.responses.splice(i, 1);
  }

  /** DELETE Selected File From Uploader Queue Before Upload */
  public removeFile(fileName: string, fileSize: number) {
    this.uploader.queue = this.uploader.queue
      .filter(item =>
        ((item._file.name !== fileName) && (item._file.size !== fileSize)));
  }

  addToConsumes(consumeType) {
    if (!this.resource.consumes.includes(consumeType)) {
      this.resource.consumes.push(consumeType);
    }
  }
  remove(value) {
    const index = this.resource.consumes.findIndex(el => el === value);
    this.resource.consumes.splice(index, 1);
  }
  removeValue(value) {
    const index = this.resource.produces.findIndex(el => el === value);
    this.resource.produces.splice(index, 1);
  }


  public addToProduces(produceType) {
    if (!this.resource.produces.includes(produceType)) {
      this.resource.produces.push(produceType);
    }
  }



  public removeFromProduces(): void {
    this.resource.produces = [];
  }

  public getParamIndex(param: Parameter): number {
    return this.parameters.findIndex((x: Parameter) => x.name === param.name);
  }

  public getGroupIndex(rg: ResourceGroup): number {
    return this.data.container.resourceGroups.findIndex((x: ResourceGroup) => x.name === rg.name);
  }

  /** NG UPLOADER METHOD */
  public fileOverBase(ev: boolean): void {
    this.hasBaseDropZoneOver = ev;
  }

  /** Get Selected File ID */
  public onSelectedFile(res: string): void {
    if (res) {
      this.selected = true;
      this.selectedFileId = res.substr(0, res.lastIndexOf('#'));
      this.selectedFileName = res.substr(res.lastIndexOf(this.activecontainer.id) + this.activecontainer.id.length + 1, res.length);
      this.selectedFileName = this.selectedFileName.split('\\').join('/');
    } else {
      this.selected = false;
      this.selectedFileId = '';
      this.selectedFileName = '';
    }
  }

  public onSelectedSecondFiles(res): void {
    if (res.length !== 0) {
      this.selectedSec = true;
      this.secondaryFiles = [];
      res.forEach(element => {
        this.selectedFileSecId = element.substr(0, element.lastIndexOf('#'));
        this.selectedFileSecName = element.substr(element.lastIndexOf(this.activecontainer.id) + this.activecontainer.id.length + 1, element.length);
        this.selectedFileSecName = this.selectedFileSecName.split('\\').join('/');
        this.secondaryFiles.push({ fileId: this.selectedFileSecId, fileUri: this.selectedFileSecName });
      });
    } else {
      this.selectedSec = false;
      this.secondaryFiles = [];
    }
  }

  /** On Reset Click delete parameters list and selected resource */
  public reset(): void {
    this.parameters = [];
    this.selected = false;
    this.selectedFileId = '';
    this.selectedFileName = '';
    this.fileExplorer.uncheckAll();
  }

  public saveResource(): void {
    if ((this.resource.customQuery.collectionName === undefined || this.resource.customQuery.collectionName === null) && this.queryType !== 'Execute' && (this.type === 'sql' && this.resource.httpMethod === 'POST')) {
      this.emptyCollection = true;
      return;
    }
    if (this.stepper.selectedIndex === 2) {
      if (this.showRequestEditor || this.showResponseEditor) {
        if (this.showResponseEditor) {
          this.responseModelError = true;
        }
        if (this.showRequestEditor) {
          this.requestModelError = true;
        }
        return null;
      }
    }
    this.responseModelError = false;
    this.requestModelError = false;
    // Create Default Group if No Resource Group exists
    if (this.resource.customQuery.collectionName === undefined && this.provider === 'MONGO' && this.stepper.steps.length === 7 && this.queryType !== 'Execute') {
      this.emptyCollection = true;
    } else {
      if ((this.queryType === 'Execute' && this.function) || this.queryType !== 'Execute') {
        this.resource.customQuery.type = this.queryType;
      }
      this.emptyCollection = false;
      if (this.resource.executionType === 'File') {
        if (this.fileNameForUpload) {
          this.parameters = [];
          this.param.in = 'formData';
          this.param.name = this.fileNameForUpload;
          this.param.type = 'File';
          this.addNewParam();
          this.resource.parameters = this.parameters;
          this.fileNameForUpload = this.resource.parameters[0].name;
        } else {
          this.param.in = 'formData';
          this.param.name = '_id';
          this.param.type = 'string';
        }
      }


      if (this.type === 'sql' && (this.resource.httpMethod === 'GET' || this.resource.httpMethod === 'DELETE')) {
        this.resource.customQuery.collectionName = '';
      }

      if (this.resource.executionType !== 'Query' && this.resource.executionType !== 'File') {
        this.resource.customQuery.query = null;
        this.resource.customQuery.type = null;
        this.resource.pageable = null;
      }

      if (this.type !== 'sql' && (this.resource.customQuery.query == null || this.resource.customQuery.query === '')) {
        this.resource.customQuery.query = '{}';
      }
      this.resource.resourceLog = this.resourceLog;

      // Verifying that the endpoint starts with /
      this.prepareEndpoint();

      if (this.forwardResponseModel !== 'null') {
        this.resource.responses[0].schema = {
          ref: this.forwardResponseModel,
          array: this.resource.customQuery.many === true ? true : false
        };
      } else {
        this.showResponseEditor = false;
        this.respModel = null;
        this.responseModel = null;
        this.resource.responses[0].schema = null;
      }
      if (this.forwardRequestModel !== 'null') {
        if ((this.resource.httpMethod === 'POST' || this.resource.httpMethod === 'PUT'|| this.resource.httpMethod === 'PATCH')) {
          const reqType = this.resource.customQuery.requestMany === true ? 'array' : 'object';
          const parmObj = new Parameter('Body', 'body', reqType, null, this.forwardRequestModel);
          parmObj.required = true;
          this.resource.parameters = this.resource.parameters.filter(el => el.in !== 'Body');
          this.resource.parameters.push(parmObj);
        }
      } else {

        this.reqModel = null;
        this.showRequestEditor = false;
        this.requestModel = null;
        const index = this.parameters.findIndex(el => el.in === 'Body');
        this.parameters[index].modelName = null;
      }
      if (this.outFunction) {
        this.resource.outFunctions = [this.outFunction.id];
        this.resource.functions = [];
      } else {
        this.resource.outFunctions = null;

      }

      if (this.inFunction) {
        this.resource.inFunctions = [this.inFunction.id];
        this.resource.functions = [];

      } else {
        this.resource.inFunctions = null;
      }
      if (this.queryType === 'Execute') {
        this.resource.customQuery.collectionName = '';

      }
      if (this.function && this.resource.customQuery.type === 'Execute') {
        this.resource.outFunctions = [];
        this.resource.inFunctions = [];
        this.resource.functions = [this.function.id];
      }
      if (this.resource.customQuery.type !== 'Execute') {
        this.resource.functions = [];
      }

      // this.containerToSave = JSON.parse(JSON.stringify(this.data.container));
      const groupIndex = this.getGroupIndex(this.Rgroup);
      const groupResources = this.containerToSave.resourceGroups[groupIndex].resources;
      const resourceIndex = this.getResourceIndex(this.resource, groupResources);
      // ADD API
      this.resource.openAPIResponses = this.convertResponseToOpenApiResponse(this.resource.responses, this.resource.produces);
      this.convertParametersToRequestBody(this.resource);

      if (this.resource.customQuery.queryName === 'count') {
        this.resource.customQuery.many = true
      }
      if (this.data.editMode === false) {
        if (resourceIndex >= 0) {
          this.apiUnicity = false;
        } else {
          this.apiUnicity = true;
          groupResources.push(this.resource);
          this.containerToSave.resourceGroups[this.getGroupIndex(this.Rgroup)].resources = groupResources;
          this.containersStore.dispatch(new containerActions.UpdateContainer(this.containerToSave, 'Resource Added'));
          this.resourceDialogRef.close();
        }
        // EDIT API
      } else {

        if (this.data.resource.httpMethod.toLowerCase() === this.resource.httpMethod.toLowerCase() && this.data.resource.path.toLowerCase() === this.resource.path.toLowerCase()) {
          // nothing changed in terms of path and method
          groupResources[resourceIndex] = this.resource;
          this.containerToSave.resourceGroups[this.getGroupIndex(this.Rgroup)].resources = groupResources;
          this.containersStore.dispatch(new containerActions.UpdateContainer(this.containerToSave, 'Resource Updated'));
          this.resourceDialogRef.close(this.containerToSave);
        } else {
          if (resourceIndex >= 0) {
            this.apiUnicity = false;
          } else {
            const oldIndex = this.getResourceIndex(this.data.resource, groupResources);
            groupResources[oldIndex] = this.resource;
            this.containerToSave.resourceGroups[this.getGroupIndex(this.Rgroup)].resources = groupResources;
            this.apiUnicity = true;
            this.containersStore.dispatch(new containerActions.UpdateContainer(this.containerToSave, 'Resource Updated'));
            this.resourceDialogRef.close(this.containerToSave);
          }
        }
      }

    }
    console.log(this.containerToSave);
  }


  private mapModelToSqlModel(model) {
    let obj = {};
    obj = model;
    model.properties.forEach(element => {
      if (element.type === 'number') {
        element.type = 'INTEGER';
      } else if (element.type === 'string') {
        element.type = 'TEXT';
      }
    });
  }

  private createTableRequest(model, id) {
    let sql = 'create table ' + model.title + ' (';
    for (const row of model.properties) {
      const element = row;
      if (element.name === 'id') {
        sql += 'id ' + model.properties[0].type + ' not null AUTO_INCREMENT ,';
      }
      if (element.type === 'number') {
        sql += element.name + ' ' + 'INTEGER,';
      } else if (element.type === 'string') {
        sql += element.name + ' ' + 'TEXT,';
      }
    }
    const modelId = model.properties.findIndex(el => el.title === 'id');
    if (modelId < 0) {
      sql += 'id INTEGER not null AUTO_INCREMENT ,';
    }
    sql += 'PRIMARY KEY (id));';
    this.dbSourceService.executeQuery({ query: sql }, id).subscribe(res => { })
  }

  private prepareEndpoint() {
    if (this.resource.path.charAt(0) !== '/') {
      this.resource.path = '/' + this.resource.path;
    }
  }

  public getResourceIndex(resourceSearchIndex: Resource, gr): number {
    return gr.findIndex((x: Resource) => x.path.toUpperCase() === resourceSearchIndex.path.toUpperCase() && x.httpMethod === resourceSearchIndex.httpMethod);
  }

  /** MatStepper Actions Control */
  public goBack(stepper: MatStepper): void {
    stepper.previous();
  }

  onInput() {
    this.checkEmptyPath();
    this.apiUnicity = true;
  }

  getPathParams(path: string) {
    if (this.resource.httpMethod === 'POST' || this.resource.httpMethod === 'PUT' || this.resource.httpMethod === 'PATCH') {
      const parameter = new Parameter();
      parameter.name = 'body';
      parameter.in = 'Body';
      parameter.type = 'object';
      parameter.description = 'This is your body parameter';
      parameter.required = true;
      if (!this.parameters.some(el => el.in === 'Body')) {
        this.parameters.push(parameter);
      }
    } else {
      const index = this.parameters.findIndex(el => el.in === 'Body');
      if (index >= 0) {
        this.parameters.splice(index, 1);
      }
    }
    const params = [];
    while (path.length > 0) {
      const param = path.substr(path.indexOf('{') + 1, path.indexOf('}') - path.indexOf('{') - 1);
      if (param.length > 0) {
        params.push(param);
      }
      path = path.slice(path.indexOf(param) + param.length + 1, path.length);
    }
    if (params.length === 0) {
      this.parameters.forEach(element => {
        const index = this.parameters.findIndex(p => p.in === 'Path');
        if (index > 0) {
          this.parameters.splice(index, 1);
        }
      });
    } else {
      params.forEach(element => {
        if (this.parameters.findIndex(p => p.in + p.name === 'Path' + element) < 0) {
          this.parameters.push(new Parameter('Path', element, 'string'));
        }
      });
    }

  }

  public generateQuery(parameters) {
    if (this.provider === 'MONGO') {
      let q = '';
      const params = parameters.filter(element => ((element.in.toLowerCase() === 'query' || element.in.toLowerCase() === 'path') && (element.name !== 'pageNumber' && element.name !== 'pageSize')));
      if (params.length === 1) {
        if (params[0].name === 'id') {
          q = '{"_id":"%id"}';
        } else {
          q = '{"' + params[0].name + '":"%' + params[0].name + '"}';
        }
        if (!this.querySnippetNames.some(e => e === ('findBy' + params[0].name.replace(/\b\w/g, l => l.toUpperCase())))) {
          this.Snippets.unshift({ name: 'findBy' + params[0].name.replace(/\b\w/g, l => l.toUpperCase()), snippet: q });
          this.querySnippetNames.unshift('findBy' + params[0].name.replace(/\b\w/g, l => l.toUpperCase()));
        }
      } else if (params.length > 1) {
        params.forEach(el => {
          if (el.name === 'id') {
            q = '{"_id":"%id"}';
          } else {
            q += ',{"' + el.name + '":"%' + el.name + '"}';
          }
          if (!this.querySnippetNames.some(e => e === ('findBy' + el.name.replace(/\b\w/g, l => l.toUpperCase())))) {
            this.Snippets.unshift({ name: 'findBy' + el.name.replace(/\b\w/g, l => l.toUpperCase()), snippet: '{"' + el.name + '":"%' + el.name + '"}' });
            this.querySnippetNames.unshift('findBy' + el.name.replace(/\b\w/g, l => l.toUpperCase()));
          }
        });
        q = q.substring(1);
        if (!this.querySnippetNames.some(e => e === ('findBy' + params[0].name.replace(/\b\w/g, l => l.toUpperCase()) + 'And' + params[1].name.replace(/\b\w/g, l => l.toUpperCase())))) {
          this.Snippets.unshift({ name: 'findBy' + params[0].name.replace(/\b\w/g, l => l.toUpperCase()) + 'And' + params[1].name.replace(/\b\w/g, l => l.toUpperCase()), snippet: '{"$and":[{' + q + ']}' });
          this.querySnippetNames.unshift('findBy' + params[0].name.replace(/\b\w/g, l => l.toUpperCase()) + 'And' + params[1].name.replace(/\b\w/g, l => l.toUpperCase()));
        }
        if (!this.querySnippetNames.some(e => e === ('findBy' + params[0].name.replace(/\b\w/g, l => l.toUpperCase()) + 'Or' + params[1].name.replace(/\b\w/g, l => l.toUpperCase())))) {
          this.Snippets.unshift({ name: 'findBy' + params[0].name.replace(/\b\w/g, l => l.toUpperCase()) + 'Or' + params[1].name.replace(/\b\w/g, l => l.toUpperCase()), snippet: '{"$or":[{' + q + ']}' });
          this.querySnippetNames.unshift('findBy' + params[0].name.replace(/\b\w/g, l => l.toUpperCase()) + 'Or' + params[1].name.replace(/\b\w/g, l => l.toUpperCase()));
        }
        q = '{"$or":[' + q + ']}';
      } else {
        q = '{}';
      }
      // if (this.updateModal === true) {
      //   this.resource.customQuery.query = q;
      // }
    }
  }


  public goForward(stepper: MatStepper): void {
    //setTimeout(() => this.codeMirrorEditor.codeMirror.refresh(), 250);
    if (stepper.selectedIndex === 2 && stepper.steps.length === 6 || stepper.selectedIndex === 1 && stepper.steps.length === 5) {
      if (this.showRequestEditor || this.showResponseEditor) {
        if (this.showResponseEditor) {
          this.responseModelError = true;
        }
        if (this.showRequestEditor) {
          this.requestModelError = true;
        }
        return null;
      }
    }
    if (!this.function && this.queryType === 'Execute') {
      this.isFunctionEmpty = true;
      return null;
    }
    if (this.function && this.queryType === 'Execute') {
      this.resource.customQuery.collectionName = '';

    }

    this.requestModelError = false;
    this.responseModelError = false;
    this.generateQuery(this.resource.parameters);

    if (stepper.selectedIndex === 0) {
      this.checkEmptyPath();
      if (this.verifyUnicity() && !this.emptyPath) {
        stepper.next();
      }
    } else if (stepper.selectedIndex === 2 && this.provider === 'MONGO') {
      console.log('collectionName ' + this.resource.customQuery.type !== 'Execute')
      if ((this.resource.customQuery.collectionName === undefined || this.resource.customQuery.collectionName === null) && this.resource.customQuery.type !== 'Execute' && !this.editorMode) {
        this.emptyCollection = true;

      } else {
        stepper.next();
        this.emptyCollection = false;
      }
    } else if (stepper.selectedIndex === 2 && this.type === 'sql') {
      if ((!this.resource.customQuery.query || this.resource.customQuery.query === undefined) && this.resource.httpMethod !== 'POST' && this.resource.customQuery.type !== 'Execute') {
        this.emptySqlQuery = false;
        return null;
      }
      if (this.resource.httpMethod === 'POST' && (this.resource.customQuery.collectionName === undefined || this.resource.customQuery.collectionName === null) && this.resource.customQuery.type !== 'Execute') {
        this.emptyCollection = true;
        return null;
      }
      stepper.next();
    } else {
      stepper.next();
    }
  }

  private checkEmptyPath() {
    if (this.resource.path === '/' || !this.resource.path) {
      this.emptyPath = true;
    } else {
      this.emptyPath = false;
    }
  }
  private checkCollection(collection) {
    if (collection) {
      this.emptyCollection = false;
    }
  }
  checkParamsContainsBody(parameters) {
    const params = parameters.map(el => el.in).filter(el => el === 'Body');
    return params.length === parameters.length;
  }
  public selectCollections() {
    this.getDatabases(this.project.dbsourceId);
  }

  /**
   * Fetch the DataBase from the selected Data Source
   * @param value the requested DataBase
   */
  private getDatabases(value: string): void {
    this.dbsourcesList.forEach(dbSource => {
      if (dbSource && dbSource.id === value) {
        this.databasesList = dbSource.databases;
      }
    });
    if (this.resource.customQuery && this.resource.customQuery.database) {
      this.getCollections(this.resource.customQuery.database);
    }

  }

  /**
   * Load the selected Database Collection List
   * @param value The Collections List
   */
  private getCollections(value): void {
    this.databasesList.forEach(database => {
      if (database.name === value) {
        if (this.getLinkedDBType() === 'nosql' || this.getLinkedDBType() === null) {
          this.collectionsList = database.collections.filter(coll => coll !== 'authentication_user');
        } else {
          this.collectionsList = database.tables.map(el => el.name);
        }
      }
    });
    if (this.resource.customQuery && this.resource.customQuery.collectionName && !this.collectionsList.find(coll => coll === this.resource.customQuery.collectionName)) {
      this.collectionsList.push(this.resource.customQuery.collectionName);
    }
  }

  addCollection() {
    this.addCollectionBool = true;
    this.oldcollectionName = this.resource.customQuery.collectionName;
    this.newCollectionName = this.resource.customQuery.collectionName;
  }
  confirmNewCollection() {
    this.addCollectionBool = false;
    this.emptyCollection = false;
    if (!this.collectionsList.find(coll => coll === this.newCollectionName)) {
      this.resource.customQuery.collectionName = this.newCollectionName;
      this.dbsourcesStore.dispatch(new dbsourceActions.AddNewCollection({ dbsourceId: this.project.dbsourceId, databaseName: this.project.databaseName, containerId: this.activecontainer.id, collectionName: this.resource.customQuery.collectionName }));
    } else {
      this.cancelNewCollection();
    }
  }
  cancelNewCollection() {
    this.addCollectionBool = false;
    this.newCollectionName = '';
    this.resource.customQuery.collectionName = this.oldcollectionName;
  }

  /**
   * Receive JSON Query Change
   * @param query for database
   */
  public getJsonChange(query): void {
    this.resource.customQuery.query = JSON.stringify(query);
  }

  xmlFileChanged(e) {
    this.xmlFile = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.param.value = fileReader.result.toString();
      this.param.name = 'body';
      this.param.type = 'string';
      this.param.in = 'Body';
      this.addNewParam();
      this.bodyExists = true;
      this.bodyContent = fileReader.result.toString();
    };
  }

  displayBody() {
    if (this.bodyContent && !this.xmlFile) {
      this.param.in = 'Body';
      this.param.name = 'body';
      this.param.type = null;
      this.param.value = this.bodyContent;
      this.addNewParam();
      this.bodyExists = true;
    }
  }

  // Projection Fields Action
  updateProjectionFields(fields: string[]) {
    const list: string[] = [];
    fields.forEach(field => list.push(field));
    this.resource.fields = list;
  }

  checkPageable() {
    this.resource.pageable = !this.resource.pageable;
    if (this.resource.pageable === true) {
      const pageSize = new Parameter('query', 'pageSize', 'string');
      pageSize.required = true;
      pageSize.description = 'Size of page';
      const pageNumber = new Parameter('query', 'pageNumber', 'string');
      pageNumber.required = true;
      pageNumber.description = 'rank of the page';
      if (!this.resource.parameters.some(el => (el.name === 'pageSize'))) {
        this.resource.parameters.push(pageSize);
        this.resource.parameters.push(pageNumber);
      }
    } else {
      this.resource.parameters.splice(this.resource.parameters.findIndex(el => (el.name === 'pageNumber')), 1);
      this.resource.parameters.splice(this.resource.parameters.findIndex(el => (el.name === 'pageSize')), 1);
    }

  }

  checkPath() {
    if (this.resource.httpMethod === 'GET') {
      this.queryType = 'Read'
      this.resource.customQuery.type = 'Read';
    } else if (this.resource.httpMethod === 'DELETE') {
      this.queryType = 'Delete'
      this.resource.customQuery.type = 'Delete';
    } else if (this.resource.httpMethod === 'PATCH') {
      this.queryType = 'Update'
      this.resource.customQuery.type = 'Update';
    } else if (this.resource.httpMethod === 'PUT') {
      this.queryType = 'Update'
      this.resource.customQuery.type = 'Update';
    } else {
      this.queryType = 'Insert'
      this.resource.customQuery.type = 'Insert';

    }
    if (!this.emptyPath) {
      this.verifyUnicity();
    }
    this.emptyCollection = false;
  }
  verifyUnicity() {
    let index = -1;
    const indexes = [];
    const groupIndex = this.getGroupIndex(this.Rgroup);
    const groupResources = this.containerToSave.resourceGroups[groupIndex].resources;
    const resourceIndex = this.getResourceIndex(this.resource, groupResources);
    this.containerToSave.resourceGroups.forEach(resourceGroup => {
      index = this.getResourceIndex(this.resource, resourceGroup.resources);
      indexes.push(index);
    })
    if (indexes.findIndex(el => el !== -1) >= 0 && resourceIndex !== this.data.ressourceIndex) {
      this.apiUnicity = false;
      return false;
    } else {
      this.apiUnicity = true;
      if (this.resource.httpMethod === 'POST' || this.resource.httpMethod === 'PUT' || this.resource.httpMethod === 'PATCH') {
        const parameter = new Parameter();
        parameter.name = 'body';
        parameter.in = 'Body';
        parameter.type = 'object';
        parameter.description = 'This is your body parameter';
        parameter.required = true;
        if (!this.parameters.some(el => el.in === 'Body')) {
          this.parameters.push(parameter);
        }
      } else {
        const ind = this.parameters.findIndex(el => el.in === 'Body');
        if (ind >= 0) {
          this.parameters.splice(ind, 1);
        }
      }
      return true;

    }

  }

  showFilesTree() {
    this.showTree = !this.showTree;
    this.showSelectBtn = true;
  }

  changeSearchValue(searchValue) {
    this.sec.onSearchChange(searchValue);
  }

  openSelectFilesModal(mode) {
    this.selectFilesModalService.openModal({ activecontainerId: this.activecontainer.id, mode });
  }

  unSelectFile(fileToDeselect: FileNode, mode: string) {
    if (mode === 'primary') {
      this.resource.resourceFile = null;
    } else {
      this.resource.secondaryFilePaths = this.resource.secondaryFilePaths.filter(file => file.fileId !== fileToDeselect.fileId);
    }
  }

  addSnippet(snippetName: string) {
    if ((this.editor.getText().length > 0) && (this.editor.getText() !== '{}')) {
      this.messageBoxService.openWarning('Replace Query', 'Your current query will be replaced, continue ?', {
        info: {
          msg: 'Replace ' + this.editor.getText() + ' with ' + this.Snippets.filter(el => el.name === snippetName)[0].snippet
        }
      }).afterClosed().subscribe(res => {
        if (res) {
          this.confirmSnippet(snippetName);
        }
      });
    } else {
      this.confirmSnippet(snippetName);
    }

  }

  private confirmSnippet(snippetName) {
    this.editor.set(JSON.parse(this.Snippets.filter(el => el.name === snippetName)[0].snippet));
    this.resource.customQuery.query = this.Snippets.filter(el => el.name === snippetName)[0].snippet;
  }

  public getLinkedDBProvider(): string {
    if (this.dbsourcesList.length > 0 && this.resource.customQuery.datasource) {
      const db = this.dbsourcesList.find(d => d.id === this.resource.customQuery.datasource);
      return db.provider;
    }
    return 'MONGO';
  }

  public getLinkedDBType(): string {
    if (this.dbsourcesList.length > 0 && this.resource.customQuery.datasource) {
      const db = this.dbsourcesList.find(d => d.id === this.resource.customQuery.datasource);
      return db.type;
    }
    return 'nosql';
  }

  public updateResourceQuery(query) {

    this.resource.customQuery.query = query;
  }

  public updateEndpointType(type) {
    this.resource.customQuery.type = type;
    this.queryType = type;

  }
  public addFunctionId(id) {
    this.resource.functions = []
    this.resource.functions.push(id)
    if (this.functionsTab.length > 0) {
      this.function = this.functionsTab.filter(el => el.id === id)[0];
    }
  }
  public parse(data, endpointsModel, mode) {

    if (data) {
      return new Promise((resolve, reject) => {
        const props = [];
        const TypescriptClass = data.toString();
        if (TypescriptClass.slice(-1) !== '}') {
          return reject('missingBraces');
        }
        // RegExp to check if the typescript file has a form of class
        const classRegExp = new RegExp('class ' + '(.*)' + '{');

        // RegExp to check if the typescript file has a form of interface
        const interfaceRegExp = new RegExp('interface ' + '(.*)' + '{');

        // RegExp to check if the typescript file has a form of enum
        const enumRegExp = new RegExp('enum ' + '(.*)' + '{');

        const types = ['string', 'number', 'boolean', 'object', 'Date'];

        const endpointModelsTitle = this.containerToSave.endpointModels.map(el => el.title);

        // check if it is a class or an interface using RegExp
        let classModel = null;
        if (TypescriptClass.match(classRegExp) !== null) {
          classModel = TypescriptClass.match(classRegExp) !== null;
        } else if (TypescriptClass.match(interfaceRegExp) !== null) {
          classModel = TypescriptClass.match(interfaceRegExp) !== null;
        } else if (TypescriptClass.match(enumRegExp) !== null) {
          classModel = TypescriptClass.match(enumRegExp) !== null;
        }
        if (classModel !== null) {
          let classValue = null;
          if (TypescriptClass.match(classRegExp) !== null) {
            classValue = TypescriptClass.split('class');
          } else if (TypescriptClass.match(interfaceRegExp) !== null) {
            classValue = TypescriptClass.split('interface');
          }
          if (classValue !== null) {
            let description = '';
            const regExp = /[a-zA-Z]/g;
            if (regExp.test(classValue[0])) {
              classValue[0].match(/\/\*[\s\S]*?\*\/|\/\/.*/g).forEach(element => {
                // get the value after // or between /* */ and because * cause probleme in regex we split

                const value = element.split('//')[1] !== undefined ? element.split('//')[1] : element.replace(/[\n\r]+/g, ' ').match(new RegExp('/* ' + '(.*)' + '*/'))[1].split('*')[0];
                const desc = value[0] === ' ' ? value : ' ' + value;
                description += desc;
              });
            }

            if (!classValue[1].split('{')[0].match(/[A-z]/g)) {
              return reject('emptyName');
            }
            const classTitle = classValue[1].split('{')[0].replace(/ /g, '');
            if (classTitle !== null && classTitle !== '') {
              if (endpointModelsTitle.includes(classTitle) && mode === 'add') {
                console.log('model alreadyExists');
                return reject('alreadyExists');
              }
              if (mode === 'edit' && !endpointModelsTitle.includes(classTitle) && !this.reqTable) {
                return reject('nameNotEditable');
              }
              // get attributes from class or interfcae
              const attributes = classValue[1].substr(classValue[1].indexOf('{') + 1, classValue[1].indexOf('}') - classValue[1].indexOf('{') - 1);
              let lastIndex = 0;
              for (let index = 0; index < attributes.replace(/[\n\r]+/g, ';').split([';']).length; index++) {
                const element = attributes.replace(/[\n\r]+/g, ';').split([';'])[index];

                const nextElement = attributes.replace(/[\n\r]+/g, ';').split([';'])[index + 1];
                let attrDescription = '';
                let example = '';

                if (nextElement !== undefined) {
                  if (nextElement.replace(/ /g, '').split('//example:').length >= 2) {
                    if (nextElement.split('//example:')[1] !== undefined) {
                      example = nextElement.split('//example:')[1];
                    }
                    if (nextElement.split('// example:')[1]) {
                      example = nextElement.split('// example:')[1];
                    }
                    if (nextElement.split('// example :')[1]) {
                      example = nextElement.split('// example :')[1];
                    }
                    if (nextElement.split('//example :')[1]) {
                      example = nextElement.split('//example :')[1];
                    }

                  }
                  if (nextElement.replace(/ /g, '').split('/*example:').length >= 2) {
                    if (nextElement.split('/*example:')[1] !== undefined) {
                      example = (nextElement.split('/*example:')[1]);
                    }
                    if (nextElement.split('/* example:')[1]) {
                      example = (nextElement.split('/* example:')[1]);
                    }
                    if (nextElement.split('/* example :')[1]) {
                      example = (nextElement.split('/* example:')[1]);
                    }
                    if (nextElement.split('/*example :')[1]) {
                      example = (nextElement.split('/*example :')[1]);
                    }

                  }

                }

                if (element !== '' && element.split(':').length > 1) {
                  if (element !== ':') {
                    // get attribute description which is before the attribute
                    for (let i = lastIndex; i < index; i++) {
                      // console.log(attributes.replace(/[\n\r]+/g, ';'))
                      let atrr = attributes.replace(/[\n\r]+/g, ';').split([';'])[i];
                      const nextAttr = attributes.replace(/[\n\r]+/g, ';').split([';'])[i + 1];
                      if (atrr.trim()[0] === '/' && atrr.trim()[1] === '*' && nextAttr.trim()[nextAttr.trim().length - 1] === '/' && nextAttr.trim()[nextAttr.trim().length - 2] === '*') {
                        atrr = (atrr + nextAttr);
                      }
                      if (atrr.match(/\/\*[\s\S]*?\*\/|\/\/.*/g)) {
                        const myValue = atrr.replace(/[\n\r]+/g, ' ');
                        if (myValue.replace(/ /g, '').split('//example:')[1] === undefined) {
                          const value = atrr.split('//')[1] !== undefined ? atrr.split('//')[1] : myValue.substr(myValue.indexOf('/*') + 1, myValue.indexOf('*/') - myValue.indexOf('/*') - 1).split('*')[1];
                          attrDescription += value;
                        }
                      }
                    }
                    const atr = element.split(':');
                    const obj = {
                      name: atr[0].trim(),
                      type: atr[1].replace(/ /g, ''),
                      ref: null,
                      array: false,
                      description: attrDescription === '' ? null : attrDescription.trim(),
                      example: example === '' ? null : example,
                      enums: []
                    };
                    if (obj.name === '' && obj.type.trim()[obj.type.trim() - 1] !== '/' && obj.type.trim()[obj.type.trim() - 2] !== '*' && obj.name.trim()[0] !== '/' && obj.name.trim()[1] !== '/' && obj.name.trim()[1] !== '*') {
                      return reject('undefinedName');
                    }
                    if (obj.name !== '' && obj.type !== undefined) {
                      // check if it's an array
                      if (obj.type.split('[]').length === 2) {
                        const arrayElementsType = obj.type.split('[]')[0];
                        // if (!(types.includes(arrayElementsType)) && !endpointModelsTitle.includes(arrayElementsType)) {
                        //   reject({ msg: 'typeError', type: arrayElementsType });
                        // }
                        // check if it is an array of simple types or an array of models (Example => array : User[])
                        if (!(types.includes(arrayElementsType)) || endpointModelsTitle.includes(arrayElementsType)) {
                          obj.ref = arrayElementsType === '' ? 'object' : arrayElementsType;
                        }
                        obj.type = arrayElementsType;
                        obj.array = true;
                      } else {
                        if (obj.type.substr(obj.type.indexOf('[') + 1, obj.type.indexOf(']') - obj.type.indexOf('[') - 1) !== '') {
                          obj.type.substr(obj.type.indexOf('[') + 1, obj.type.indexOf(']') - obj.type.indexOf('[') - 1).split(',').forEach(ele => {
                            obj.enums.push(ele);
                          });
                          obj.type = 'string';
                        } else {
                          if (!(types.includes(obj.type)) && obj.name[0] !== '/' && obj.name[1] !== '/' && obj.name[1] !== '*' && !endpointModelsTitle.includes(obj.type) && obj.name.match(/\/\*[\s\S]*?\*\/|\/\/.*/g) === null) {
                            if (obj.type === '') {
                              return reject('undefinedType');
                            } else {
                              return reject({ msg: 'typeError', type: obj.type });
                            }
                          }
                        }
                        if (endpointModelsTitle.includes(obj.type)) {
                          obj.ref = obj.type;
                        }
                      }
                      lastIndex = index;
                      if (obj.name.match(/\/\*[\s\S]*?\*\/|\/\/.*/g) === null && obj.name[0] !== '/' && obj.name[1] !== '/' && obj.name[1] !== '*') {
                        if (obj.enums.length === 0) {
                          obj.enums = null;
                        }
                        props.push(obj);
                      }
                    }
                    if (obj.name.match(/\/\*[\s\S]*?\*\/|\/\/.*/g) === null && obj.name[0] !== '/' && obj.name[1] !== '/' && obj.name[1] !== '*' && (obj.type === undefined || obj.type === '')) {
                      return reject('undefinedType');
                    }
                  }
                }
                if (element !== '' && element.split('=').length > 1) {
                  if (element !== '=') {
                    const atr = element.split('=');

                    for (let i = lastIndex; i < index; i++) {
                      let atrr = attributes.replace(/[\n\r]+/g, ';').split([';'])[i];
                      const nextAttr = attributes.replace(/[\n\r]+/g, ';').split([';'])[i + 1];
                      if (atrr.trim()[0] === '/' && atrr.trim()[1] === '*' && nextAttr.trim()[nextAttr.trim().length - 1] === '/' && nextAttr.trim()[nextAttr.trim().length - 2] === '*') {
                        atrr = (atrr + nextAttr);
                      }
                      if (atrr.match(/\/\*[\s\S]*?\*\/|\/\/.*/g)) {
                        const myValue = atrr.replace(/[\n\r]+/g, ' ');
                        const value = atrr.split('//')[1] !== undefined ? atrr.split('//')[1] : myValue.substr(myValue.indexOf('/*') + 1, myValue.indexOf('*/') - myValue.indexOf('/*') - 1).split('*')[1];
                        attrDescription += value;
                      }
                    }
                    let objType = '';
                    if (/'*'/.test(atr[1].replace(/ /g, '')) || /"*"/.test(atr[1].replace(/ /g, ''))) {
                      objType = 'string';
                    } else if (atr[1].replace(/ /g, '') === 'true' || atr[1].replace(/ /g, '') === 'false') {
                      objType = 'boolean';
                    } else if (!isNaN(atr[1].replace(/ /g, '')) && atr[1].replace(/ /g, '') !== '') {
                      objType = 'number';
                    } else if (atr[1].replace(/ /g, '').split('[]').length > 1) {
                      objType = 'array';
                    }
                    const obj = {
                      name: (atr[0].replace(/ /g, '')).replace(/[?]/, ''),
                      type: objType,
                      ref: null,
                      array: objType === 'array' ? true : false,
                      description: attrDescription === '' ? null : attrDescription.trim(),
                      example: example === '' ? null : example,
                    };

                    if (obj.name[0] !== '/' && obj.name[1] !== '/' && obj.name[1] !== '*' && (obj.type === null || obj.type === undefined || obj.type === '')) {
                      return reject('undefinedType');
                    }
                    if (obj.name === '') {
                      return reject('undefinedName');
                    } else {
                      lastIndex = index;
                      if (obj.name.match(/\/\*[\s\S]*?\*\/|\/\/.*/g) === null && obj.name[0] !== '/' && obj.name[1] !== '/' && obj.name[1] !== '*') {
                        props.push(obj);
                      }
                    }
                  }
                }
              }

              const endpointModel = {
                title: classTitle,
                properties: props,
                description: description !== '' ? description.trim() : null
              };
              if (!endpointsModel.some(el => el.title === endpointModel.title)) {
                endpointsModel.push(endpointModel);
              } else {
                const index = endpointsModel.findIndex(el => el.title === endpointModel.title);
                endpointsModel[index] = endpointModel;
              }
              resolve(endpointsModel);
            } else {
              return reject('emptyName');
            }
          } else {
            if (TypescriptClass.match(enumRegExp) !== null) {
              const enumValue = TypescriptClass.split('enum');
              let description = '';
              const regExp = /[a-zA-Z]/g;
              if (regExp.test(enumValue[0])) {
                enumValue[0].match(/\/\*[\s\S]*?\*\/|\/\/.*/g).forEach(element => {
                  // get the value after // or between /* */ and because * cause probleme in regex we split
                  const value = element.split('//')[1] !== undefined ? element.split('//')[1] : element.replace(/[\n\r]+/g, ' ').match(new RegExp('/* ' + '(.*)' + '*/'))[1].split('*')[0];
                  const desc = value[0] === ' ' ? value : ' ' + value;
                  description += desc;
                });
              }

              if (!enumValue[1].split('{')[0].match(/[A-z]/g)) {
                return reject('emptyName');
              }
              const enumTitle = enumValue[1].split('{')[0].replace(/ /g, '');
              if (enumTitle === null) {
                return reject('emptyName');
              }
              const valuesArray = [];
              const values = enumValue[1].substr(enumValue[1].indexOf('{') + 1, enumValue[1].indexOf('}') - enumValue[1].indexOf('{') - 1);
              values.split(',').forEach(val => {
                valuesArray.push(val);
              });

              const endpointModel = {
                title: enumTitle,
                description: description !== '' ? description : null,
                enums: valuesArray.length > 0 ? valuesArray : null,
                type: 'string'
              };
              if (!endpointsModel.some(el => el.title === endpointModel.title)) {
                endpointsModel.push(endpointModel);
              } else {
                const index = endpointsModel.findIndex(el => el.title === endpointModel.title);
                endpointsModel[index] = endpointModel;
              }
              resolve(endpointsModel);
            } else {
              return reject('emptyClass');
            }
          }
        } else {
          return reject('classModel');
        }
      });
    } else {
      this.toaster.error(this.translateService.getMessage('toaster.model.error'));
    }
  }
  parseModel(model) {
    const parsedModel = model === 'response' ? this.responseModel : this.requestModel;
    this.parse(parsedModel, this.endpointModels, 'add').then(res => {
      this.endpointModels.forEach(endpointModel => {
        if (!this.containerToSave.endpointModels.some(em => em.title === endpointModel.title)) {
          this.containerToSave.endpointModels.push(endpointModel);
          if (model === 'response') {
            this.respModel = endpointModel.title;
            this.addResponseModel(this.respModel);
            this.showResponseEditor = false;
          }
          if (model === 'request') {
            this.reqModel = endpointModel.title;
            this.addRequestModel(this.reqModel);
            this.showRequestEditor = false;
          }
          this.toaster.success(this.translateService.getMessage('toaster.model.added'));
        }
      });

    },
      error => {
        this.mode = 'add';
        model === 'response' ? this.responseMode = 'add' : this.requestMode = 'add';
        if (error === 'classModel') {
          this.toaster.error(this.translateService.getMessage('toaster.model.error.classModel'));
        }
        if (error === 'emptyName') {
          this.toaster.error(this.translateService.getMessage('toaster.model.error.emptyName'));
        }
        if (error === 'undefinedName') {
          this.toaster.error(this.translateService.getMessage('toaster.model.error.undefinedName'));
        }
        if (error === 'undefinedType') {
          this.toaster.error(this.translateService.getMessage('toaster.model.error.undefinedType'));
        }
        if (error === 'missingBraces') {
          this.toaster.error(this.translateService.getMessage('toaster.model.error.missingBraces'));
        }
        if (error.msg === 'typeError') {
          this.toaster.error(this.translateService.getMessageWithParams('toaster.model.error.typeError', { type: error.type }));
        }
        if (error === 'alreadyExists') {
          this.toaster.error(this.translateService.getMessage('toaster.model.error.alreadyExists'));
        }
      });
  }
  addRequestModel(model) {
    if (model !== 'null') {
      this.showRequestEditor = true;
      this.mode = 'edit';
      this.requestMode = 'edit';
      const modelIndex = this.containerToSave.endpointModels.findIndex(el => el.title === model);
      if (modelIndex >= 0) {
        const modelDescription = this.containerToSave.endpointModels[modelIndex].description;
        if (this.containerToSave.endpointModels[modelIndex].enums) {
          let typescriptClass = modelDescription !== null ? '/*' + modelDescription + ' */' + ' \n enum ' : 'enum ';
          typescriptClass = typescriptClass + this.containerToSave.endpointModels[modelIndex].title + ' { ';
          typescriptClass += this.containerToSave.endpointModels[modelIndex].enums.join(', ');
          typescriptClass = typescriptClass + '}';
          this.requestModel = typescriptClass;
          this.forwardRequestModel = model;
        } else {
          let typescriptClass = modelDescription !== null ? '/*' + modelDescription + ' */' + ' \n class ' : 'class ';
          typescriptClass = typescriptClass + this.containerToSave.endpointModels[modelIndex].title + ' { \n';
          if (this.containerToSave.endpointModels[modelIndex].properties) {
            this.containerToSave.endpointModels[modelIndex].properties.forEach(prop => {
              let type = ['integer', 'number'].includes(prop.type) ? 'number' : prop.type;
              if ((type === 'array' || type === 'object' || type === null) && prop.ref !== null) {
                type = prop.ref;
              }
              if (prop.array) {
                if (prop.description) {
                  typescriptClass += ('\t' + '/*' + prop.description + ' */' + ' \n');
                }
                typescriptClass += ('\t' + prop.name + ': ' + type + '[]' + ';');
                if (prop.example) {
                  typescriptClass += (' // example : ' + prop.example);
                }
                typescriptClass += (' \n');
              } else {
                if (prop.description) {
                  typescriptClass += ('\t' + '/* ' + prop.description + ' */' + ' \n');
                }
                typescriptClass += ('\t' + prop.name + ': ' + type + '; ');
                if (prop.example) {
                  typescriptClass += (' // example : ' + prop.example);
                }
                typescriptClass += (' \n');
              }
            });
          }
          typescriptClass = typescriptClass + '}';
          this.requestModel = typescriptClass;
          this.forwardRequestModel = model;
        }

      }
    } else {
      this.showRequestEditor = false;
      this.forwardRequestModel = model;
      this.reqModel = null;
    }
  }
  viewRequestModel() {
    if (this.reqModel !== null) {
      this.showRequestEditor = true;
      this.mode = 'edit';
      this.requestMode = 'edit';
      const modelIndex = this.containerToSave.endpointModels.findIndex(el => el.title === this.reqModel);
      if (modelIndex >= 0) {
        const modelDescription = this.containerToSave.endpointModels[modelIndex].description;
        if (this.containerToSave.endpointModels[modelIndex].enums) {
          let typescriptClass = modelDescription !== null ? '/*' + modelDescription + ' */' + ' \n enum ' : 'enum ';
          typescriptClass = typescriptClass + this.containerToSave.endpointModels[modelIndex].title + ' { ';
          typescriptClass += this.containerToSave.endpointModels[modelIndex].enums.join(', ');
          typescriptClass = typescriptClass + '}';
          this.requestModel = typescriptClass;
        } else {
          let typescriptClass = modelDescription !== null ? '/*' + modelDescription + ' */' + ' \n class ' : 'class ';
          typescriptClass = typescriptClass + this.containerToSave.endpointModels[modelIndex].title + ' { \n';
          if (this.containerToSave.endpointModels[modelIndex].properties) {
            this.containerToSave.endpointModels[modelIndex].properties.forEach(prop => {
              let type = ['integer', 'number'].includes(prop.type) ? 'number' : prop.type;
              if ((type === 'array' || type === 'object') && prop.ref !== null) {
                type = prop.ref;
              }
              if (prop.array) {
                if (prop.description) {
                  typescriptClass += ('\t' + '/*' + prop.description + ' */' + ' \n');
                }
                typescriptClass += ('\t' + prop.name + ': ' + type + '[]' + ';');
                if (prop.example) {
                  typescriptClass += (' // example : ' + prop.example);
                }
                typescriptClass += (' \n');
              } else {
                if (prop.description) {
                  typescriptClass += ('\t' + '/* ' + prop.description + ' */' + ' \n');
                }
                typescriptClass += ('\t' + prop.name + ': ' + type + '; ');
                if (prop.example) {
                  typescriptClass += (' // example : ' + prop.example);
                }
                typescriptClass += (' \n');
              }
            });
          }
          typescriptClass = typescriptClass + '}';
          this.requestModel = typescriptClass;
        }
      }
    }

  }



  viewResponseModel() {
    if (this.respModel !== null) {
      this.showResponseEditor = true;
      this.mode = 'edit';
      this.responseMode = 'edit';
      const modelIndex = this.containerToSave.endpointModels.findIndex(el => el.title === this.respModel);
      const modelDescription = this.containerToSave.endpointModels[modelIndex].description;
      if (this.containerToSave.endpointModels[modelIndex].enums) {
        let typescriptClass = modelDescription !== null ? '/*' + modelDescription + ' */' + ' \n enum ' : 'enum ';
        typescriptClass = typescriptClass + this.containerToSave.endpointModels[modelIndex].title + ' { ';
        typescriptClass += this.containerToSave.endpointModels[modelIndex].enums.join(', ');
        typescriptClass = typescriptClass + '}';
        this.responseModel = typescriptClass;
      } else {
        let typescriptClass = modelDescription !== null ? '/*' + modelDescription + ' */' + ' \n class ' : 'class ';
        typescriptClass = typescriptClass + this.containerToSave.endpointModels[modelIndex].title + ' { \n';
        if (this.containerToSave.endpointModels[modelIndex].properties) {
          this.containerToSave.endpointModels[modelIndex].properties.forEach(prop => {
            let type = ['integer', 'number'].includes(prop.type) ? 'number' : prop.type;
            if ((type === 'array' || type === 'object') && prop.ref !== null) {
              type = prop.ref;
            }
            if (prop.array) {
              if (prop.description) {
                typescriptClass += ('\t' + '/*' + prop.description + ' */' + ' \n');
              }
              typescriptClass += ('\t' + prop.name + ': ' + type + '[]' + ';');
              if (prop.example) {
                typescriptClass += (' // example : ' + prop.example);
              }
              typescriptClass += (' \n');
            } else {
              if (prop.description) {
                typescriptClass += ('\t' + '/* ' + prop.description + ' */' + ' \n');
              }
              typescriptClass += ('\t' + prop.name + ': ' + type + '; ');
              if (prop.example) {
                typescriptClass += (' // example : ' + prop.example);
              }
              typescriptClass += (' \n');
            }
          });
        }
        typescriptClass = typescriptClass + '}';
        this.responseModel = typescriptClass;
        window.scroll(0, 0);
      }
    }


  }

  addResponseModel(model) {
    if (model !== 'null') {
      this.showResponseEditor = true;
      this.mode = 'edit';
      this.responseMode = 'edit';
      const modelIndex = this.containerToSave.endpointModels.findIndex(e => e.title === model);
      const modelDescription = this.containerToSave.endpointModels[modelIndex].description;
      if (this.containerToSave.endpointModels[modelIndex].enums) {
        let typescriptClass = modelDescription !== null ? '/*' + modelDescription + ' */' + ' \n enum ' : 'enum ';
        typescriptClass = typescriptClass + this.containerToSave.endpointModels[modelIndex].title + ' { ';
        typescriptClass += this.containerToSave.endpointModels[modelIndex].enums.join(', ');
        typescriptClass = typescriptClass + '}';
        this.responseModel = typescriptClass;
        this.forwardResponseModel = model;
        // this.toaster.success(this.translateService.getMessage('toaster.model.response'));
      } else {
        let typescriptClass = modelDescription !== null ? '/*' + modelDescription + ' */' + ' \n class ' : 'class ';
        typescriptClass = typescriptClass + this.containerToSave.endpointModels[modelIndex].title + ' { \n';
        if (this.containerToSave.endpointModels[modelIndex].properties) {
          this.containerToSave.endpointModels[modelIndex].properties.forEach(prop => {
            let type = ['integer', 'number'].includes(prop.type) ? 'number' : prop.type;
            if ((type === 'array' || type === 'object' || type === null) && prop.ref !== null) {
              type = prop.ref;
            }
            if (prop.array) {
              if (prop.description) {
                typescriptClass += ('\t' + '/*' + prop.description + ' */' + ' \n');
              }
              typescriptClass += ('\t' + prop.name + ': ' + type + '[]' + ';');
              if (prop.example) {
                typescriptClass += (' // example : ' + prop.example);
              }
              typescriptClass += (' \n');
            } else {
              if (prop.description) {
                typescriptClass += ('\t' + '/* ' + prop.description + ' */' + ' \n');
              }
              typescriptClass += ('\t' + prop.name + ': ' + type + '; ');
              if (prop.example) {
                typescriptClass += (' // example : ' + prop.example);
              }
              typescriptClass += (' \n');
            }
          });
        }

        typescriptClass = typescriptClass + '}';
        this.responseModel = typescriptClass;
        this.forwardResponseModel = model;
      }

    } else {
      this.showResponseEditor = false;
      this.forwardResponseModel = model;
      this.respModel = null;
    }

  }
  importRequestModel() {
    const len = this.requestUploader.queue.length - 1;
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.requestModel = fileReader.result.toString();
    };
    fileReader.readAsText(this.requestUploader.queue[len]._file);
  }
  importResponseModel() {
    const len = this.responseUploader.queue.length - 1;
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.responseModel = fileReader.result.toString();
    };
    fileReader.readAsText(this.responseUploader.queue[len]._file);
  }
  getEnumValues(params?) {
    if (params) {
      return params.join(' ,');
    }

  }
  editParam(parameter) {

    this.dialog.open(ParamsModalComponent,
      {
        width: '70%',
        position: {
          top: '1vh'
        },
        data: {
          param: parameter,
          parameters: this.parameters,
          resource: this.resource
        }
      }).afterClosed().subscribe(res => {
        if (res !== undefined) {
          this.parameters = res.parameters;
          this.resource = res.resource;
          this.ref.detectChanges();
        }
      });
  }
  openPramsModal() {
    this.dialog.open(ParamsModalComponent,
      {
        width: '70%',
        position: {
          top: '1vh'
        },
        data: {
          parameters: this.parameters,
          resource: this.resource
        }
      }).afterClosed().subscribe(res => {
        if (res !== undefined) {
          this.ref.detectChanges();
          this.parameters = res.parameters;
          this.resource = res.resource;
        }
      });
  }
  generateBodySnipets(collectionName) {
    this.Snippets = [];
    this.querySnippetNames = [];
    let q = '';

    this.dbSourceService.getCollectionAttributes(this.data.resource.customQuery.datasource, this.data.resource.customQuery.database, collectionName).subscribe(res => {
      if (res) {
        res.forEach(element => {
          if (element === 'id') {
            q = '{"_id":"%id"}';
          } else {
            q = '{"' + element + '":"%' + element + '"}';
          }
          this.Snippets.push({ name: 'findBy' + element.replace(/\b\w/g, l => l.toUpperCase()), snippet: q });
          this.querySnippetNames.push('findBy' + element.replace(/\b\w/g, l => l.toUpperCase()));
        });
        if (res.length > 2) {
          if (res[1] === 'id' || res[2] === 'id') {
            if (res[1] === 'id') {
              q = '[{"_id":"%id"},{"' + res[2] + '":"%' + res[2] + '"}]';
            }
            if (res[2] === 'id') {
              q = '[{"' + res[1] + '":"%' + res[1] + '"},{"_id":"%id"}]';
            }
          } else {
            q = '[{"' + res[1] + '":"%' + res[1] + '"},{"' + res[2] + '":"%' + res[2] + '"}]';
          }
          this.Snippets.push({ name: 'findBy' + res[1].replace(/\b\w/g, l => l.toUpperCase()) + 'And' + res[2].replace(/\b\w/g, l => l.toUpperCase()), snippet: '{"$and":' + q + '}' });
          this.Snippets.push({ name: 'findBy' + res[1].replace(/\b\w/g, l => l.toUpperCase()) + 'Or' + res[2].replace(/\b\w/g, l => l.toUpperCase()), snippet: '{"$or":' + q + '}' });
          this.querySnippetNames.push('findBy' + res[1].replace(/\b\w/g, l => l.toUpperCase()) + 'And' + res[2].replace(/\b\w/g, l => l.toUpperCase()));
          this.querySnippetNames.push('findBy' + res[1].replace(/\b\w/g, l => l.toUpperCase()) + 'Or' + res[2].replace(/\b\w/g, l => l.toUpperCase()));
        }
      }
    });

  }
  editModel(model) {
    const modelToEdit = model === 'request' ? this.requestModel : this.responseModel;
    this.parse(modelToEdit, this.endpointModels, 'edit').then(res => {
      if (res && !this.reqTable && !this.respTable) {
        const index = this.containerToSave.endpointModels.findIndex(el => el.title === res[0].title);
        this.containerToSave.endpointModels[index] = res[0];
        this.containersStore.dispatch(new containerActions.UpdateContainer(this.containerToSave, this.translateService.getMessage('toaster.model.updated')));
      }
      if (res && this.reqTable) {
        this.reqModel = res[0].title
        const index = this.containerToSave.endpointModels.findIndex(el => el.title === res[0].title);
        if (index < 0) {
          this.containerToSave.endpointModels.push(res[0]);
        }
        this.addRequestModel(this.reqModel)
        this.containersStore.dispatch(new containerActions.UpdateContainer(this.containerToSave, this.translateService.getMessage('toaster.model.added')));
      }
      if (res && this.respTable) {
        this.respModel = res[0].title
        const index = this.containerToSave.endpointModels.findIndex(el => el.title === res[0].title);
        if (index < 0) {
          this.containerToSave.endpointModels.push(res[0]);
        }
        this.addResponseModel(this.respModel)
        this.containersStore.dispatch(new containerActions.UpdateContainer(this.containerToSave, this.translateService.getMessage('toaster.model.added')));
      }


    },
      error => {
        if (error === 'classModel') {
          this.toaster.error(this.translateService.getMessage('toaster.model.error.classModel'));
        }
        if (error === 'emptyName') {
          this.toaster.error(this.translateService.getMessage('toaster.model.error.emptyName'));
        }
        if (error === 'undefinedName') {
          this.toaster.error(this.translateService.getMessage('toaster.model.error.undefinedName'));
        }
        if (error === 'undefinedType') {
          this.toaster.error(this.translateService.getMessage('toaster.model.error.undefinedType'));
        }
        if (error === 'missingBraces') {
          this.toaster.error(this.translateService.getMessage('toaster.model.error.missingBraces'));
        }
        if (error.msg === 'typeError') {
          this.toaster.error(this.translateService.getMessageWithParams('toaster.model.error.typeError', { type: error.type }));
        }
        if (error === 'alreadyExists') {
          this.toaster.error(this.translateService.getMessage('toaster.model.error.alreadyExists'));
        }
        if (error === 'nameNotEditable') {
          this.toaster.error(this.translateService.getMessage('toaster.model.error.noNameEdit'));
        }
      });
  }

  saveModel(model) {
    model === 'request' ? this.requestModelError = false : this.responseModelError = false;
    if (this.mode === 'add') {
      this.parseModel(model);
    } else if (this.mode === 'edit') {
      this.editModel(model);
    }
  }


  checkCode(code) {
    if (code > 199 && code < 300) {
      return true;
    }
    return false;
  }

  convertResponseToOpenApiResponse(responses, producesList) {

    const openApiResponses = [];
    const code = 'code';
    const description = 'description';
    const content = 'content';
    const application = 'application/json';
    const schema = 'schema';
    const headers = 'headers';
    const examples = 'exemples';
    responses.forEach(element => {
      const openApiResponse = {};
      openApiResponse[code] = element.code;
      openApiResponse[description] = element.description;
      openApiResponse[content] = {};
      if (JSON.stringify(element.headers) !== '{}' && element.headers !== null && element.headers !== undefined) {
        openApiResponse[headers] = {};
        openApiResponse[headers][headers] = Object.values(element.headers)[0];
      }
      if (JSON.stringify(element.exemples) !== '{}' && element.exemples !== null && element.exemples !== undefined) {
        openApiResponse[examples] = {};
        openApiResponse[examples][application] = {};
        openApiResponse[examples][application].value = JSON.stringify(Object.values(element.exemples)[0]);
      }
      if (element.schema != null) {
        if (element.code === '200') {
          producesList.forEach(el => {
            openApiResponse[content][el] = {};
            openApiResponse[content][el][schema] = element.schema;
          });
        } else {
          openApiResponse[content][application] = {};
          openApiResponse[content][application][schema] = element.schema;
        }
      } else {
        openApiResponse[content] = {};
      }
      openApiResponses.push(openApiResponse);
    });
    return openApiResponses;
  }

  convertOpenAPIResponseToOpenResponse(openAPIResponses, resource) {
    const responses = [];
    const code = 'code';
    const description = 'description';
    const schema = 'schema';
    const headers = 'headers';
    const exemples = 'exemples';
    const json = 'application/json';
    openAPIResponses.forEach(element => {
      const response = {};
      response[code] = element.code;
      response[description] = element.description;
      if (element.content != null) {
        if (JSON.stringify(element.content) !== '{}') {
          if (JSON.stringify(element.content) !== '{}') {
            response[schema] = Object.values(element.content)[0][schema];
            if (response[schema].array === true && element.code === '200') {
              resource.customQuery.many = true;
            }
          }
        }
        if (JSON.stringify(element.headers) !== '{}' && element.headers !== null && element.headers !== undefined) {
          response[headers] = {};
          response[headers][headers] = Object.values(element.headers)[0];
        }
        if (JSON.stringify(element.content[json]) !== '{}' && (element.content[json] !== null && element.content[json] !== undefined)) {
          if (JSON.stringify(element.content[json].examples) !== '{}' && (element.content[json].examples !== null && element.content[json].examples !== undefined)) {
            response[exemples] = {};
            let jsonValue = '';
            try {
              jsonValue = JSON.parse((Object.values(element.content[json].examples)[0] as any).value);
              response[exemples][json] = jsonValue;
            } catch (error) {
              console.log(error);
            }
          } else {
            if (JSON.stringify(element.exemples) !== '{}' && (element.exemples !== null && element.exemples !== undefined)) {
              response[exemples] = {};
              let jsonValue = '';
              try {
                jsonValue = JSON.parse((Object.values(element.exemples)[0] as any).value);
                response[exemples][json] = jsonValue;
              } catch (error) {
                console.log(error);
              }
            }
          }
        }

        Object.keys(element.content).forEach(el => {
          if (el !== '*/*') {
            if (!resource.produces.some(c => c === el)) {
              resource.produces.push(el);
            }
          }
        });
      }
      responses.push(response);
    });
    return responses;
  }



  convertRequestBodiesToParameter(requestBody, resource) {
    const schema = 'schema';
    const ref = 'ref';

    if (requestBody != null && JSON.stringify(requestBody.content) !== '{}') {
      const parameter = { in: 'Body', name: 'body', type: 'object', value: '', required: true, description: '', modelName: '' };
      parameter.description = requestBody.description;
      if (requestBody.content != null) {
        if (JSON.stringify(requestBody.content) !== '{}') {
          if (JSON.stringify(requestBody.content) !== '{}') {
            parameter.modelName = Object.values(requestBody.content)[0][schema][ref];
          }
        }
        Object.keys(requestBody.content).forEach(el => {
          if (el !== '*/*') {
            if (!resource.consumes.some(c => c === el)) {
              resource.consumes.push(el);
            }
          }
        });
      }
      resource.parameters.push(parameter);
    }
  }

  convertParametersToRequestBody(resource) {
    const requestBody = { description: '', required: true, content: {} };
    if (resource.parameters.length !== 0) {
      resource.parameters.forEach(element => {
        if (element.in.toLowerCase() === 'body') {
          requestBody.description = element.description;
          requestBody.required = element.required;
          if (element.modelName && resource.consumes.length !== 0) {
            resource.consumes.forEach(el => {
              const type = {};
              const schemaCont = { schema: { ref: '' } };
              schemaCont.schema.ref = element.modelName;
              type[el] = schemaCont;
              requestBody.content = type;
            });
          }
        }
      });
      resource.requestBody = requestBody;
    }
  }

  compareById(f1: any, f2: any): boolean {
    return f1 && f2 && f1.id === f2.id;
  }

  viewOutFunction() {
    this.showOutFunction = !this.showOutFunction;
  }

  viewInFunction() {
    this.showInFunction = !this.showInFunction;
  }
  viewFunction() {
    this.showFunction = !this.showFunction;
  }

  openCreateDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '100vw';
    dialogConfig.height = '80%';
    dialogConfig.panelClass = 'full-screen-modal';
    dialogConfig.position = {
      top: '100px  '
    };
    dialogConfig.data = {
      editMode: false,
      projectId: this.data.container.projectId,
      functions: this.functions
    }
    const dialogRef = this.dialog.open(FunctionModalComponent, dialogConfig);
    dialogRef.afterClosed().subscribe();

  }
  getTablesToModel() {
    this.showTables = true;
  }
  getTablesToModelResp() {
    this.showRespTables = true;
  }
  transformSQLType(type) {
    switch (type) {
      case 'VARCHAR':
        return 'string';
      case 'TEXT':
        return 'string';
      case 'MEDIUMTEXT':
        return 'string';
      case 'INT':
        return 'number';
      case 'DECIMAL':
        return 'number';
      case 'DATE':
        return 'Date';
      case 'TINYINT':
        return 'boolean';
      case 'BIT':
        return 'boolean';
      case 'SMALLINT':
        return 'number';
      default:
        return 'string';
    }
  }
  generateModelFromTable(table, modelType) {
    this.databasesList.forEach(database => {
      if (database.name === this.resource.customQuery.database) {
        const tab = database.tables.filter(el => el.name === table)[0]
        let classValue = 'class ' + tab.name + ' { \n';
        tab.columns.forEach(t => {
          classValue += '  ' + t.name + ' : ' + this.transformSQLType(t.type) + ';\n'
        })
        classValue += '}'
        if (modelType === 'req') {
          this.requestModel = classValue;
          this.reqTable = true;
        }
        if (modelType === 'resp') {
          this.responseModel = classValue
        }
      }
    });
}
  selectFunction(event) {
    if (this.function.language === 'OpenFaas' && this.resource.httpMethod !== 'POST') {
      this.showOpenFaasPostWarning = true;
    } else {
      this.showOpenFaasPostWarning = false;
    }
  }
}
