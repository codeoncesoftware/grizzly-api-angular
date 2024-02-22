import { Component, OnInit } from '@angular/core';
import { APPCONFIG } from '../../config';
import * as authActions from './../../store/authentication/auth.actions';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { AuthService } from 'src/app/auth/auth.service';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/store/authentication/auth.state';
import { User } from 'src/app/shared/models/User';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html'
})

export class AppHeaderComponent implements OnInit {
  public AppConfig: any;
  isFr: boolean;
  selectedLanguage: string;
  user: any = {};
  leftDays = 0;
  firstName: string;
  lastName: string;

  authUrl  = '';
  doc = '';

  constructor(private appTranslateService: AppTranslateService, private authService: AuthService, private store: Store<AuthState>) {

  }

  ngOnInit() {
    this.AppConfig = APPCONFIG;
    this.authUrl = environment.authURL;
    this.doc = environment.doc;
    // Set i18n Language
    if (localStorage.getItem('grizzly-lang')) {
      this.setLang(localStorage.getItem('grizzly-lang').toLowerCase());
    } else {
      this.setLang(navigator.language);
    }

    const email = localStorage.getItem('userEmail');
    this.authService.getUser(email).subscribe(user => {
      this.user = user;
      if (user.accountType === 'FREE') {
        this.leftDays = this.getDaysLeft(user);
      }
    });

    this.store.select('auth').subscribe(res => {
      if (res.user.firstName) {
        this.firstName = res.user.firstName;
        this.lastName = res.user.lastName;
      } else {
        this.store.dispatch(new authActions.LoginUser(localStorage.getItem('userEmail')));
     }
    });
  }
  getDaysLeft(user) {
    const registrationDate = new Date(user.registrationDate);
    const expirationDate = registrationDate.setDate(registrationDate.getDate() + 30);
    const x = new Date(expirationDate);
    const today = new Date();
    // tslint:disable-next-line:max-line-length
    return Math.floor((Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) ) / (1000 * 60 * 60 * 24));
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

  logout() {
    this.authService.logout();
  }
}
