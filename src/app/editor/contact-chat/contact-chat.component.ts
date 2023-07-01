import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-contact-chat',
  templateUrl: './contact-chat.component.html',
  styleUrls: ['./contact-chat.component.scss']
})
export class ContactChatComponent implements OnInit {

  date = new Date();
  typing = true;

  @Input()
  showWidget;

  @Output()
  closeWidgetEmitted = new EventEmitter();

  constructor() { }

  ngOnInit() {
    setTimeout(() => this.typing = false, 2500);
  }

  emitCloseWidget() {
    this.closeWidgetEmitted.emit();
    this.showWidget = false;
  }

}
