import { Component, OnInit } from '@angular/core';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';

@Component({
  selector: 'app-free-trial-expired',
  templateUrl: './free-trial-expired.component.html',
  styleUrls: ['./free-trial-expired.component.scss']
})
export class FreeTrialExpiredComponent implements OnInit {

  isFr: boolean;
  selectedLanguage: string;
  constructor(private appTranslateService: AppTranslateService) { }

  ngOnInit(): void {

       // Set i18n Language
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
