import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Parameter } from 'src/app/shared/models/Parameter';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DataService } from 'src/app/shared/services/data/data.service';
@Component({
  selector: 'app-params-modal',
  templateUrl: './params-modal.component.html',
  styleUrls: ['./params-modal.component.sass']
})
export class ParamsModalComponent implements OnInit {
  @ViewChild('enumInput') memberInput: ElementRef<HTMLInputElement>;
  param = new Parameter();
  disableDefaultValue = false;
  parameters = [];
  showEnumList = false;
  myControl = new UntypedFormControl();
  enumValues: string[] = [];
  values: string[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  public Editor = ClassicEditor;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredOptions: Observable<string[]>;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ParamsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ,
    private dataService : DataService) { }

  ngOnInit(): void {
    this.parameters = this.data.parameters;
    if (this.data.param) {
      this.param = Object.assign({} , this.data.param) ;
      this.values = this.param.enums === (null || undefined) ? [] : this.param.enums;
      if (this.values !== undefined && this.values !== null) {
        if (this.values.length > 0) {
          this.showEnumList = true;
        }
      }
    }
    if (this.param.description === undefined) {
      this.param.description = '';
    }
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.enumValues.filter(option => option.toLowerCase().includes(filterValue));
  }
  addOption(option) {


    if ((option || '').trim() && (!this.values.some(val => val === option))) {
      this.values.push(option);
      this.memberInput.nativeElement.value = '';
    } else {
      this.memberInput.nativeElement.value = '';
    }
  }
  add(event: MatChipInputEvent): void {

    const input = event.input;
    const value = event.value;
    // Add our member
    if ((value || '').trim() && !this.values.some(el => el === value)) {

      this.values.push(value);

    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  remove(val: any): void {
    const index = this.values.indexOf(val);
    if (index >= 0) {
      this.values.splice(index, 1);
    }

  }
  public addNewParam() {

    if (this.param.name && this.param.type && this.param.in) {
      if (this.param.type.toLowerCase() === 'file') {
        if (!this.data.resource.consumes.find(str => str === 'multipart/form-data')) {
          this.data.resource.consumes.push('multipart/form-data');
        }
      }
      if (this.param.required === undefined) {
        this.param.required = false;
      }
      if (this.param.type === 'enum') {
        this.param.enums = this.values;
        this.param.type = 'string';
      }
      if (this.data.param) {
        const index = this.data.parameters.findIndex(el => el.in === this.data.param.in && el.type === this.data.param.type && el.name === this.data.param.name);
        this.data.parameters[index] = this.param;
        if (this.data.resource.path !== null && this.param.in.toUpperCase() === 'PATH') {
          this.data.resource.path = this.data.resource.path.replace(this.data.param.name , this.param.name);
        }
      } else {
        this.data.parameters.push(this.param);
        if (this.data.resource.path !== null && this.param.in.toUpperCase() === 'PATH') {
          if (this.data.resource.path.slice(-1) === '/') {
            this.data.resource.path = this.data.resource.path + '{' + this.param.name + '}';
          } else {
            this.data.resource.path = this.data.resource.path + '/{' + this.param.name + '}';
          }

        }
      }
      this.dataService.emitPramas({ parameters: this.data.parameters, resource: this.data.resource })
      this.dialogRef.close({ parameters: this.data.parameters, resource: this.data.resource });

    }
  }
  public checkIfFileIsSelected() {
    if (this.param.type.toLowerCase() === 'file') {
      this.disableDefaultValue = true;
    } else {
      this.disableDefaultValue = false;

    }
    if (this.param.type === 'enum') {
      this.showEnumList = true;
    } else {
      this.showEnumList = false;
    }
  }


}
