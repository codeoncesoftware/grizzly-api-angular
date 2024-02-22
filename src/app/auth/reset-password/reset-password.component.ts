import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../errorStateMatcher';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  password: string;
  confirmPassword: string;
  token: string;

  isFr: boolean;
  selectedLanguage: string;
  successfulReset = false;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private authService: AuthService, private appTranslateService: AppTranslateService) { }

  ngOnInit() {

    this.resetForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords(this.resetForm) });
    this.token = this.route.snapshot.paramMap.get('token');

    // Set i18n Language
    if (localStorage.getItem('grizzly-lang')) {
      this.setLang(localStorage.getItem('grizzly-lang').toLowerCase());
    } else {
      this.setLang(navigator.language);
    }

  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    if (group) {
      const pass = group.controls.password.value;
      const confirmPass = group.controls.confirmPassword.value;

      return (pass === confirmPass) ? null : { notSame: true };
    }
  }

  resetPassword() {
    if (this.password === this.confirmPassword) {
      this.authService.resetPassword(this.token, this.password).subscribe(() => {
        this.successfulReset = true;
      });
    }
  }

  setLang(lang: string) {

    this.appTranslateService.setDefaultLang(lang);
    localStorage.setItem('grizzly-lang', lang.toLowerCase());

    if (lang.includes('fr')) {
      this.selectedLanguage = 'FR';
      this.isFr = false;
    } else {
      this.selectedLanguage = 'EN';
      this.isFr = true;
    }

  }

}
