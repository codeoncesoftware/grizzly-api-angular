import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { APIResponse } from 'src/app/shared/models/APIResponse';
import { Header } from 'src/app/shared/models/Header';
import { Headers } from 'src/app/shared/models/Headers';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { MatStepper } from '@angular/material/stepper';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { Store } from '@ngrx/store';
import { ContainerState } from 'src/app/store/container/container.state';
import * as containerActions from '../../store/container/container.actions';


@Component({
  selector: 'app-codes-modal',
  templateUrl:'./codes-modal.component.html',
  styleUrls: ['./codes-modal.component.scss']
})

export class CodesModalComponent implements OnInit {
  mode: string;
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;
  example: any;
  response = new APIResponse();
  header = new Header();
  headers = [];
  endpointModels = [];
  public Editor = ClassicEditor;
  headerExist = false;
  errorCode = false;
  errorDescription = false;
  containerToSave: any = {};
  showResponseEditor = false;
  respModel = null;
  public responseUploader: FileUploader = new FileUploader({});
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
  constructor(
    private containersStore: Store<ContainerState>,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CodesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toaster: ToastrService,
    private translateService: AppTranslateService) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mainMenuBar = false;
  }

  ngOnInit(): void {
    this.example = JSON.parse('{}');
    this.editorOptions.mode = 'code';
    this.editorOptions.modes = ['code']; // set all allowed modes
    if (this.data.response) {
      this.response = this.data.response;
      // this.showResponseEditor = true;
      if (this.response.exemples) {
        this.example = this.response.exemples['application/json'];
      }
      if (this.response.schema) {
        this.respModel = this.response.schema.ref;
      }
      if (this.response.headers) {
        Object.keys(this.response.headers.headers).forEach((k) => {
          const header = new Header(k, this.response.headers.headers[k].description, this.response.headers.headers[k].type);
          this.headers.push(header);
        });
      }
    }
    if (this.response.description === undefined) {
      this.response.description = '';
    }
    this.containerToSave = this.data.container;
  }
  public getJsonChange(example): void {
    this.example = example;
  }
  addNewCode() {
    this.response.headers = new Headers();
    this.response.headers.headers = [];
    if (JSON.stringify(this.example) !== JSON.stringify({})) {
      this.response.exemples = {};
      this.response.exemples['application/json'] = this.example;
    }
    const headers = {};
    this.headers.forEach(element => {
      headers[element.name] = new Header(element.name, element.description, element.type);
    });
    this.response.headers.headers = headers;
    if (!this.data.responses.some(el => el.code === this.response.code)) {
      this.data.responses.push(this.response);
    } else {
      const index = this.data.responses.findIndex(el => el.code === this.response.code);
      this.data.responses[index] = this.response;
    }
    this.dialogRef.close({ responses: this.data.responses, container: this.containerToSave });
  }
  addHeader(header) {
    if (!this.headers.some(el => el.name === header.name && el.type === header.type)) {
      this.headers.push(header);
      this.header = new Header();
      this.headerExist = false;
    } else {
      this.headerExist = true;
    }

  }
  deleteHeader(index) {
    this.headers.splice(index, 1);
  }
  saveModel() {
    if (this.mode === 'add') {
      this.parseModel();
    } else if (this.mode === 'edit') {
      this.editResponseModel();
    }
  }
  editResponseModel() {
    this.parse(this.responseModel, this.endpointModels, 'edit').then(res => {
      if(res) {
        const index = this.containerToSave.endpointModels.findIndex(el => el.title === res[0].title);
        this.containerToSave.endpointModels[index] = res[0];
        this.containersStore.dispatch(new containerActions.UpdateContainer(this.containerToSave, this.translateService.getMessage('toaster.model.updated')));
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

  public parseModel() {
    this.parse(this.responseModel, this.endpointModels , 'add').then(res => {
      this.endpointModels.forEach(endpointModel => {
        if (!this.containerToSave.endpointModels.some(em => em.title === endpointModel.title)) {
          this.containerToSave.endpointModels.push(endpointModel);
          this.respModel = endpointModel.title;
          this.addResponseModel(this.respModel);
          this.showResponseEditor = false;
          this.toaster.success(this.translateService.getMessage('toaster.model.added'));

        } else {
          const modelIndex = this.containerToSave.endpointModels.findIndex(em => em.title === endpointModel.title);
          this.containerToSave.endpointModels[modelIndex] = endpointModel;
          this.respModel = endpointModel.title;
          this.addResponseModel(this.respModel);
          this.showResponseEditor = false;
          this.toaster.success(this.translateService.getMessage('toaster.model.updated'));
        }
      });

    },
      error => {
        this.mode = 'add';
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

        const types = ['string', 'number', 'boolean', 'object'];

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
              if (mode === 'edit' && !endpointModelsTitle.includes(classTitle)) {
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
                          // console.log(value)
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
  viewResponseModel() {
    if (this.respModel !== null) {
      this.showResponseEditor = true;
      this.mode = 'edit';
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
      }
    }


  }
  addResponseModel(model) {
    if (model !== 'null') {
      this.showResponseEditor = true;
      this.mode = 'edit';
      const modelIndex = this.containerToSave.endpointModels.findIndex(el => el.title === model);
      const modelDescription = this.containerToSave.endpointModels[modelIndex].description;
      if (this.containerToSave.endpointModels[modelIndex].enums) {
        let typescriptClass = modelDescription !== null ? '/*' + modelDescription + ' */' + ' \n enum ' : 'enum ';
        typescriptClass = typescriptClass + this.containerToSave.endpointModels[modelIndex].title + ' { ';
        typescriptClass += this.containerToSave.endpointModels[modelIndex].enums.join(', ');
        typescriptClass = typescriptClass + '}';
        this.responseModel = typescriptClass;
        this.response.schema = {
          ref: model,
          array: false
        };
        this.toaster.success(this.translateService.getMessage('toaster.model.response'));
      } else {
        let typescriptClass = modelDescription !== null ? '/*' + modelDescription + ' */' + ' \n class ' : 'class ';
        typescriptClass = typescriptClass + this.containerToSave.endpointModels[modelIndex].title + ' { \n';
        if (this.containerToSave.endpointModels[modelIndex].properties) {
          this.containerToSave.endpointModels[modelIndex].properties.forEach(prop => {
            const type = ['integer', 'number'].includes(prop.type) ? 'number' : prop.type;
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
        this.response.schema = {
          ref: model,
          array: false
        };
        this.toaster.success(this.translateService.getMessage('toaster.model.response'));
      }
    } else {
      this.showResponseEditor = false;
      this.respModel = null;
      this.responseModel = null;
      this.response.schema = null;
    }

  }
  importRequestModel() {
    const len = this.responseUploader.queue.length - 1;
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.responseModel = fileReader.result.toString();
    };
    fileReader.readAsText(this.responseUploader.queue[len]._file);
    this.mode = 'edit';
  }
  toggleResponseEditor() {
    this.showResponseEditor = !this.showResponseEditor;
    if (this.showResponseEditor) {
      this.mode = 'add';
    }
  }
  next() {
    if (this.response.code && this.response.description) {
      this.errorDescription = false;
      this.errorCode = false;
      this.stepper.next();
    } else {
      if (!this.response.code) {
        this.errorCode = true;
      } else {
        this.errorCode = false;
      }
      if (!this.response.description) {
        this.errorDescription = true;
      } else {
        this.errorDescription = false;
      }

    }
  }
}
