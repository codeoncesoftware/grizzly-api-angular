//import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-clone-function-modal',
  templateUrl: './clone-function-modal.component.html',
  styleUrls: ['./clone-function-modal.component.scss']
})
export class CloneFunctionModalComponent implements OnInit {
  form: UntypedFormGroup;
  version: string;
  name: string;
  constructor(private fb: UntypedFormBuilder, private dialogRef: MatDialogRef<CloneFunctionModalComponent>,@Inject(MAT_DIALOG_DATA) data) {
    this.version = data.version;
    this.name = data.name;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      version: [this.version, Validators.required],
    });
  }

  save() {
    this.form.get('version').setValue(this.version);
    const { value, valid } = this.form;
    if (valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  getErrorMessage() {
    if (this.form.hasError('required')) {
      return 'You must enter a value';
    }

  }

  close() {
    this.dialogRef.close();
  }

}
