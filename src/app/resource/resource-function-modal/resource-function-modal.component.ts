import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { FunctionState } from 'src/app/store/function/function.state';

@Component({
  selector: 'app-resource-function-modal',
  templateUrl: './resource-function-modal.component.html',
  styleUrls: ['./resource-function-modal.component.scss']
})
export class ResourceFunctionModalComponent implements OnInit {

  outFunction;
  inFunction;
  function;

  constructor(public dialogRef: MatDialogRef<ResourceFunctionModalComponent>, private functionStore: Store<FunctionState>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.functionStore.select('functions').subscribe((d) => {
      const functonsString = 'functions';
      if (this.data.element.outFunctions) {
        const o = d[functonsString].filter(((x) => x.id === this.data.element.outFunctions[0]));
        if (o.length === 1) {
          this.outFunction = o[0];
        }
      }
      if (this.data.element.inFunctions) {
        const i = d[functonsString].filter(x => x.id === this.data.element.inFunctions[0]);
        if (i.length === 1) {
          this.inFunction = i[0];
        }
      }
      if (this.data.element.functions) {
        const i = d[functonsString].filter(x => x.id === this.data.element.functions[0]);
        if (i.length === 1) {
          this.function = i[0];
        }
      }
    });

    console.log(this.function);

  }


}
