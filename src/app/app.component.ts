import * as jQuery from 'jquery';
import { Component, OnInit } from '@angular/core';

import { APPCONFIG } from './config';
import { NavigationEnd, Router, Event } from '@angular/router';
import { Title } from '@angular/platform-browser';

import {environment} from '../environments/environment';

declare const gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'grizzlyApiAngular';
  public AppConfig: any;
  constructor(public router: Router,
              public titleService: Title
  ) {
    gtag('config', environment.gtag_id);
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.split('/')[1].match(/^editor.*$/)) {
          this.titleService.setTitle('Grizzly Editor');
        } else {
          this.titleService.setTitle('Grizzly API');
        }
      }
    });
  }
  ngOnInit() {
    this.AppConfig = APPCONFIG;
  }

}
