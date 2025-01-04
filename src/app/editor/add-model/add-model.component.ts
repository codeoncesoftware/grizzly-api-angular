import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { Container } from 'src/app/shared/models/Container';
import { Parameter } from 'src/app/shared/models/Parameter';
import { Resource } from 'src/app/shared/models/Resource';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import * as containerActions from '../../store/container/container.actions';
import { ContainerState } from 'src/app/store/container/container.state';
import { Store } from '@ngrx/store';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { MessageService } from 'src/app/shared/message-modal/message.service';
import { ResourceGroup } from 'src/app/shared/models/ResourceGroup';

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss']
})
export class AddModelComponent implements OnInit {
  modelToPass = `
  // desciption of your model
  class User {
    // username description
    username : string; // example : john@example.com
    /* password description */
    password : string;
    enabled : boolean;
    age : number;
  }`;
  swaggerModel = null;
  showModelEditor = false;
  showModelEditorForManage = false;
  showModelEditorForAdd = false;
  public requestUploader: FileUploader = new FileUploader({});

  containerToSave: Container = new Container();

  endpointModels = [];
  parameters = [] as Parameter[];
  resource: Resource;
  @ViewChild('codeMirror') private codeEditorCmp: CodemirrorComponent;


  constructor(
    public dialogRef: MatDialogRef<AddModelComponent>,
    public toaster: ToastrService,
    public translateService: AppTranslateService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private containersStore: Store<ContainerState>,
    private messageBoxService: MessageService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => this.codeEditorCmp.codeMirror.refresh(), 1000);

    this.containerToSave = this.data.container;
    this.endpointModels = this.data.container.endpointModels;
  }

  toggleEditor() {
    this.modelToPass = `
    // desciption of your model
    class User {
      // username description
      username : string; // example : john@example.com
      /* password description */
      password : string;
      enabled : boolean;
      age : number;
    }`;
    this.showModelEditorForManage = false;
    this.showModelEditorForAdd = true;
  }
  importRequestModel() {
    const len = this.requestUploader.queue.length - 1;
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.modelToPass = fileReader.result.toString();
    };
    fileReader.readAsText(this.requestUploader.queue[len]._file);
  }

  editModel() {
    this.parse(this.modelToPass, this.endpointModels, 'edit').then(res => {
      this.containersStore.dispatch(new containerActions.UpdateContainer(this.containerToSave, this.translateService.getMessage('toaster.model.updated')));

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
    this.parse(this.modelToPass, this.endpointModels, 'add').then(res => {
      let x = 0;

      for (const endpointModel of this.endpointModels) {
        if (!this.containerToSave.endpointModels.some(em => em.title === endpointModel.title)) {
          this.containerToSave.endpointModels.push(endpointModel);
        }
        x++;
        if (x === this.endpointModels.length) {
          this.containersStore.dispatch(new containerActions.UpdateContainer(this.containerToSave, this.translateService.getMessage('toaster.model.added')));
          this.dialogRef.close();
        }
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
              if (mode === 'edit' && classTitle !== this.swaggerModel) {
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
                  if(element !== ':') {
                    // get attribute description which is before the attribute
                    for (let i = lastIndex; i < index; i++) {
                      let atrr = attributes.replace(/[\n\r]+/g, ';').split([';'])[i];
                      const nextAttr =  attributes.replace(/[\n\r]+/g, ';').split([';'])[i+1];
                      if(atrr.trim()[0] === '/' && atrr.trim()[1] === '*' && nextAttr.trim()[nextAttr.trim().length -1] === '/' && nextAttr.trim()[nextAttr.trim().length -2] === '*') {
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
                    if (obj.name === '' && obj.type.trim()[ obj.type.trim() -1] !== '/' && obj.type.trim()[ obj.type.trim() -2] !== '*' &&  obj.name.trim()[0] !== '/' && obj.name.trim()[1] !== '/' && obj.name.trim()[1] !== '*') {
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
                          if (!(types.includes(obj.type)) && obj.name[0] !== '/' && obj.name[1] !== '/'  && obj.name[1] !== '*' && !endpointModelsTitle.includes(obj.type) && obj.name.match(/\/\*[\s\S]*?\*\/|\/\/.*/g) === null) {
                           if(obj.type === '') {
                            return  reject('undefinedType');
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
                      if (obj.name.match(/\/\*[\s\S]*?\*\/|\/\/.*/g) === null  && obj.name[0] !== '/' && obj.name[1] !== '/' && obj.name[1] !== '*') {
                        if (obj.enums.length === 0) {
                          obj.enums = null;
                        }
                        props.push(obj);
                      }
                    }
                    if (obj.name.match(/\/\*[\s\S]*?\*\/|\/\/.*/g) === null && obj.name[0] !== '/' && obj.name[1] !== '/'  && obj.name[1] !== '*' && (obj.type === undefined || obj.type === '')) {
                      return reject('undefinedType');
                    }
                  }
                }
                if (element !== '' && element.split('=').length > 1) {
                  if(element !== '=') {
                    const atr = element.split('=');

                    for (let i = lastIndex; i < index; i++) {
                      let atrr = attributes.replace(/[\n\r]+/g, ';').split([';'])[i];
                      const nextAttr =  attributes.replace(/[\n\r]+/g, ';').split([';'])[i+1];
                      if(atrr.trim()[0] === '/' && atrr.trim()[1] === '*' && nextAttr.trim()[nextAttr.trim().length -1] === '/' && nextAttr.trim()[nextAttr.trim().length -2] === '*') {
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

                    if (obj.name[0] !== '/' && obj.name[1] !== '/' && obj.name[1] !== '*'  && (obj.type === null || obj.type === undefined || obj.type === '')) {
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
                return  reject('emptyName');
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
  showModel(model) {
    if (this.swaggerModel !== null) {
      this.showModelEditorForManage = true;
      this.showModelEditorForAdd = false;
      const modelIndex = this.containerToSave.endpointModels.findIndex(el => el.title === model);
      const modelDescription = this.containerToSave.endpointModels[modelIndex].description;
      if (this.containerToSave.endpointModels[modelIndex].enums) {
        let typescriptClass = modelDescription !== null ? '/*' + modelDescription + ' */' + ' \n enum ' : 'enum ';
        typescriptClass = typescriptClass + this.containerToSave.endpointModels[modelIndex].title + ' { ';
        typescriptClass += this.containerToSave.endpointModels[modelIndex].enums.join(', ');
        typescriptClass = typescriptClass + '}';
        this.modelToPass = typescriptClass;
      } else {
        let typescriptClass = modelDescription !== null ? '/*' + modelDescription + ' */' + ' \n class ' : 'class ';
        typescriptClass = typescriptClass + this.containerToSave.endpointModels[modelIndex].title + ' { \n';
        if (this.containerToSave.endpointModels[modelIndex].properties) {
          this.containerToSave.endpointModels[modelIndex].properties.forEach(prop => {
            let type = ['integer', 'number'].includes(prop.type) ? 'number' : prop.type;
            if((type === 'array' || type === 'object') &&  prop.ref !== null) {
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
        this.modelToPass = typescriptClass;
      }
    }
  }
  deleteModel() {
    const endpoints = [];
    this.containerToSave.resourceGroups.forEach((rg: ResourceGroup) => {
      if (rg.resources) {
        if(rg.resources.length > 0) {
          rg.resources.forEach(resource => {
              if(resource.parameters.filter(el => el.modelName === this.swaggerModel).length > 0) {
                endpoints.push(resource);
              } else if(resource.responses[0].code === '200' &&  resource.responses[0].schema !== null) {
                if(resource.responses[0].schema.ref === this.swaggerModel) {
                  endpoints.push(resource);
                }
              }
          });
        }
      }
    });

    this.messageBoxService.openWarningWithArray(this.translateService.getMessageWithParams( 'popups.model.delete.msg' , {modelName : this.swaggerModel}), 'messageBox.model.delete', endpoints , null)
      .afterClosed().subscribe((data) => {
        if (data) {
          this.containerToSave.resourceGroups.forEach((rg: ResourceGroup) => {
            if (rg.resources) {
              if(rg.resources.length > 0) {
                rg.resources.forEach(resource => {
                   resource.parameters = resource.parameters.filter(el => el.modelName !== this.swaggerModel);
                   if(resource.responses[0].code === '200' &&  resource.responses[0].schema !== null) {
                     if(resource.responses[0].schema.ref === this.swaggerModel ) {
                      resource.responses[0].schema = null;
                     }
                   }
                });
              }
            }
          });
          const modelIndex = this.containerToSave.endpointModels.findIndex(el => el.title === this.swaggerModel);
          this.containerToSave.endpointModels.splice(modelIndex, 1);
          this.containersStore.dispatch(new containerActions.UpdateContainer(this.containerToSave, this.translateService.getMessage('toaster.model.deleted')));
          this.dialogRef.close();
        }
      });
  }

}
