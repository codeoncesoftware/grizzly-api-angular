/**
 * In order to use the info section, you need to insert an object into params with this format :
 * info: {
 *        msg: value,
 *        infos: [val1, val2]
 *        }
 * And add the values in i18n
 */
import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { window } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessageModalComponent implements OnInit {

  mode: number;
  array = [];
  withCancel : any;
  withUpgrade = false;
  URL = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any , private router : Router) { }

  ngOnInit() {
    this.mode = this.data.mode;
    this.withUpgrade = this.data.upgradeAccount === true ? true : false;
    if(this.data.array) {
      this.array = this.data.array;
    }
    this.withCancel = this.data.withCancel ? this.data.withCancel : false;
    this.URL = environment.authURL
  }

  redirectToLogin(){
    this.router.navigateByUrl(environment.authURL)
  }
}
