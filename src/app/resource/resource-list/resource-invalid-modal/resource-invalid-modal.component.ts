import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Resource } from 'src/app/shared/models/Resource';
import { ResourceModalComponent } from '../../resource-modal/resource-modal.component';

@Component({
  selector: 'app-resource-invalid-modal',
  templateUrl: './resource-invalid-modal.component.html',
  styleUrls: ['./resource-invalid-modal.component.scss']
})
export class ResourceInvalidModalComponent implements OnInit {
  resource: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.resource = this.data;
  }

}
