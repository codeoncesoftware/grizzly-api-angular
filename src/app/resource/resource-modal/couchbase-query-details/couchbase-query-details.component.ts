import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
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
import 'codemirror/mode/sql/sql';
import { FunctionState } from 'src/app/store/function/function.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-couchbase-query-details',
  templateUrl: './couchbase-query-details.component.html',
  styleUrls: ['./couchbase-query-details.component.scss']
})
export class CouchbaseQueryDetailsComponent implements OnInit {

  @Input()
  query: string;

  @Input()
  resource: any;

  @Input()
  type = 'Insert';

  @Input()
  reqModel: any;

  @Input()
  respModel: any;

  @Input()
  httpMethod: string;

  @Input()
  databaseType: string;

  @Input()
  buckets: string[];

  @Output()
  queryFilled = new EventEmitter<string>();

  @Output()
  typeSelected = new EventEmitter<string>();

  @Input()
  emptyCollection: boolean;

  @Input()
  emptySqlQuery: boolean;

  @Input()
  differentModel = false;
  showOpenFaasPostWarning = false;

  @Output()
  functionID = new EventEmitter<string>();

  options = {
    extraKeys: { 'Ctrl-Space': 'autocomplete', 'Shift-Tab': 'autoFormatSelection' },
    autofocus: true,
    mode: 'text/x-mysql',
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
    lint:true

  };
  allFunctions=[]
  function : any;
  public showFunction = false;

  constructor(private functionStore: Store<FunctionState>,) {
  }

  ngOnInit() {
    if(this.query){
      this.query = '      ' + this.query;
    }else{
      this.query = '   ';
    }
    const f = 'functions';
    this.functionStore.select('functions').subscribe((data) =>
    {
      this.allFunctions = data[f];
      if(this.resource.functions){
        if(this.resource.functions.length > 0){
          this.function = this.allFunctions.filter( e => e.id === this.resource.functions[0])[0] ;
        }
      }
    }
    );    }

  private checkCollection(collection) {
    if (this.reqModel != null || this.respModel != null) {
      if (this.reqModel != null) {
        if (collection !== this.reqModel) {
          this.differentModel = true;
        } else {
          this.differentModel = false;
        }
      }
      if (this.respModel != null) {
        if (collection !== this.respModel) {
          this.differentModel = true;
        } else {
          this.differentModel = false;
        }
      }

    }

    if (collection) {
      this.emptyCollection = false;
    }
  }
  viewFunction() {
    this.showFunction = !this.showFunction;
  }
  updateQuery(query) {
    this.queryFilled.emit(this.query);
  }

  emitEndpointType(type) {
    this.typeSelected.emit(type);
    this.resource.customQuery.type = type
  }

  emitFunction(functionVar){
    if(this.function.language === 'OpenFaas' && this.resource.httpMethod !== 'POST'){
      this.showOpenFaasPostWarning = true;
    } else {
      this.showOpenFaasPostWarning = false;
    }
    this.functionID.emit(functionVar.id);
  }
}
