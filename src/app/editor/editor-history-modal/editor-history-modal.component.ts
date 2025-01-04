import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor-history-modal',
  templateUrl: './editor-history-modal.component.html',
  styleUrls: ['./editor-history-modal.component.scss']
})
export class EditorHistoryModalComponent implements OnInit {

  microservices = [];
  constructor() { }
  displayedColumns: string[] = ['name', 'version', 'lastUpdate'];
  ngOnInit(): void {
    if(localStorage.getItem('otherContainers')) {
      this.microservices = JSON.parse (localStorage.getItem('otherContainers'));
    }
  }
  delete(id) {
    const otherContainers = JSON.parse (localStorage.getItem('otherContainers'));
    const index = otherContainers.findIndex(el => el.id === id);
    const msIndex =  this.microservices.findIndex(el => el.id === id);
    otherContainers.splice(index , 1);
    this.microservices.splice(msIndex , 1);
    localStorage.setItem('otherContainers' ,JSON.stringify (otherContainers));
  }

}
