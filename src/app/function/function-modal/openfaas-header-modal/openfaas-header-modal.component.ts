import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Parameter } from 'src/app/shared/models/Parameter';


@Component({
  selector: 'app-openfaas-header-modal',
  templateUrl: './openfaas-header-modal.component.html',
  styleUrls: ['./openfaas-header-modal.component.scss']
})
export class OpenfaasHeaderModalComponent implements OnInit {

  constructor(public dialogRefFunction: MatDialogRef<OpenfaasHeaderModalComponent>,@Inject(MAT_DIALOG_DATA) public data){

  }

  isConfirmed=false;
  isEditMode: boolean;
  insertedName: string;
  insertedValue: string;
  selectedType: string;
  types: string[] = ['string','integer','number','boolean'];

  ngOnInit(){
    if(this.data.isEditMode){
      this.insertedName=this.data.header.type;
      this.insertedValue=this.data.header.value;
      this.selectedType=this.data.header.name;
    }
  }

  save(){
    if(this.insertedName && this.insertedValue && this.selectedType )
    {
      this.dialogRefFunction.close({ parameter: {name:this.insertedName,value:this.insertedValue,type:this.selectedType} });

    }
    else{
      this.isConfirmed=true;
    }

  }

}
