import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { User } from 'src/app/shared/models/User';
import { MyErrorStateMatcher } from '../errorStateMatcher';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';

@Component({
  selector: 'app-sign-up',
  styleUrls: ['./sign-up.component.scss'],
  templateUrl: './sign-up.component.html'
})

export class SignUpComponent implements OnInit, AfterViewInit {
  separateDialCode = false;
  user = new User();
  confirmPassword: string;
  signedup: boolean;
  exists: boolean;
  error: boolean;
  isFr: boolean;
  selectedLanguage: string;
  userForm: UntypedFormGroup;
  matcher = new MyErrorStateMatcher();

  countryCode: string;
  validPhoneNumber = true;

 // @ViewChild('phoneSelect', { static: false }) phoneSelect: NgxPhoneSelectDirective;

  constructor(private authService: AuthService, private formBuilder: UntypedFormBuilder, private appTranslateService: AppTranslateService) { }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      //phone: ['', [Validators.required]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });

    // Set i18n Language
    if (localStorage.getItem('grizzly-lang')) {
      this.setLang(localStorage.getItem('grizzly-lang').toLowerCase());
    } else {
      this.setLang(navigator.language);
    }

  }

  ngAfterViewInit() {
    // this.phoneSelect.setCountry('fr');
    this.countryCode = 'fr';
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

  checkPasswords(group: UntypedFormGroup) { // here we have the 'passwords' group
    if (group) {
      const pass = group.controls.password.value;
      const confirmPass = group.controls.confirmPassword.value;
      return (pass === confirmPass) ? null : { notSame: true };
    }
  }

  // convenience getter for easy access to form fields
  get userFormControls() { return this.userForm.controls; }

  signup() {
    // if (this.phoneSelect.isValidNumber() === false) {
    //   this.validPhoneNumber = false;
    //   // Stop The Submit If the Phone Number Is Invalid
    //   return;
    // } else {
    //   this.validPhoneNumber = true;
    // }
    if (this.confirmPassword !== this.user.password) {
      this.error = true;
      return;
    }
    this.error = false;
    this.exists = false;
    this.signedup = false;
    // send service to check name
    const userToSend = { ...this.user };
    // Add the Country Code For the Phone Number
    // if (this.user.phone) {
    //   userToSend.phone = this.phoneSelect.getCountryData().iso2 + '#' + this.phoneSelect.getCountryData().dialCode + '#' + this.user.phone;
    // }
    this.authService.signup(userToSend).subscribe(res => {
      if (res) {
        this.signedup = true;
      }
    },
      err => {
        if (err.status === 302) {
          this.exists = true;
          this.signedup = false;
        }

      }
    );
  }
}
