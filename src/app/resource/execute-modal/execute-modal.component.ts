import { Component, OnInit, Inject, ElementRef, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-execute-modal',
  templateUrl: './execute-modal.component.html',
  styleUrls: ['./execute-modal.component.scss']
})
export class ExecuteModalComponent implements OnInit, AfterViewInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    document.querySelector('#content')['contentWindow'].document.write(this.data.content);
  }
}
