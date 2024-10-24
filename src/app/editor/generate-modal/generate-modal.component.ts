import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditorService } from '../editor.service';
import * as fileSaver from 'file-saver';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-generate-modal',
  templateUrl: './generate-modal.component.html',
  styleUrls: ['./generate-modal.component.scss']
})
export class GenerateModalComponent implements OnInit {

  baseUrl = 'https://generator.swagger.io/api/gen/';

  choice: any;
  format: any;
  disableBtn = false;

  constructor( public dialogRef: MatDialogRef<GenerateModalComponent>,
               public dialog: MatDialog,
               @Inject(MAT_DIALOG_DATA) public data: any,
               private editorService: EditorService,
               private http: HttpClient) { }

  ngOnInit(): void {

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for(let i = 0; i < this.data.groups.length; i++) {
      if (this.data.groups[i].resources.length === 0) {
        this.disableBtn = true;
      } else {
        this.disableBtn = false;
        break;
      }
    }

  }

  download() {
    this.baseUrl +=  this.choice + '/' + this.format;

    this.editorService.generateServerClient(this.baseUrl, this.data.body).subscribe(res => {
      window.open(res.link);
      this.dialogRef.close();
    });
  }



}
