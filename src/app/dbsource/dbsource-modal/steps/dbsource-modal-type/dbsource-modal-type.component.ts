import { Component, Input, OnInit } from '@angular/core';
import { DBSource } from 'src/app/shared/models/DBSource';

@Component({
  selector: 'app-dbsource-modal-type',
  templateUrl: './dbsource-modal-type.component.html',
  styleUrls: ['./dbsource-modal-type.component.scss']
})
export class DbsourceModalTypeComponent implements OnInit {

  constructor() { }
  @Input() dbSource: DBSource;

  ngOnInit(): void {
  }

}
