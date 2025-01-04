import { Component, Input, OnInit } from '@angular/core';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { buildInfo } from 'src/generated/build-info';

@Component({
  selector: 'app-header-editor',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isFr: boolean;
  selectedLanguage: string;
 buildInfo: any;

  constructor(private appTranslateService: AppTranslateService) { }

  ngOnInit() {
    this.buildInfo = buildInfo;

    if (localStorage.getItem('grizzly-lang')) {
      this.setLang(localStorage.getItem('grizzly-lang').toLowerCase());
    } else {
      this.setLang(navigator.language);
    }

  }

  setLang(lang: string) {

    this.appTranslateService.setDefaultLang(lang);
    localStorage.setItem('grizzly-lang', lang);

    if (lang.includes('fr')) {
      this.selectedLanguage = 'FR';
      this.isFr = false;
    } else {
      this.selectedLanguage = 'EN';
      this.isFr = true;
    }

  }

}
