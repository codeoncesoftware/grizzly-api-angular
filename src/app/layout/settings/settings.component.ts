import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/shared/models/User';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/auth/errorStateMatcher';
import { AuthService } from 'src/app/auth/auth.service';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/store/authentication/auth.state';
import * as authActions from './../../store/authentication/auth.actions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private authService: AuthService, private formBuilder: UntypedFormBuilder, private store: Store<AuthState>) { }

  // convenience getter for easy access to form fields
  get userFormControls() { return this.userForm.controls; }
  isFr: boolean;
  selectedLanguage: string;
  user: any = new User();
  userToUpdate = new User();
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  // Forms
  userForm: UntypedFormGroup;
  pwdForm: UntypedFormGroup;
  matcher = new MyErrorStateMatcher();
  // Variables for Front messages
  show: boolean;
  updateSuccess: boolean;
  exists: boolean;
  error: boolean;
  validPhone = true;
  countryCode: string;
  validPhoneNumber = true;
  hideOldPassword: boolean;
  pwdUpdated = false;
  formLocked = true;
  authUrl = '';
  showPaymentForm = false;


  ngOnInit() {
    this.authUrl = environment.authURL;
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['',],
      apiKey: ['', Validators.required],
      accountType: ['', Validators.required],
    });
    this.pwdForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, { validator: this.checkPasswords });
    this.oldPassword = '';
    this.getUser();
  }


  checkPasswords(group: UntypedFormGroup) { // here we have the 'passwords' group
    if (group) {
      const pass = group.controls.password.value;
      const confirmPass = group.controls.confirmPassword.value;
      if (!pass && !confirmPass) {
        return null;
      }
      return (pass === confirmPass) ? null : { notSame: true };
    }
  }

  updateProfile() {
    if (this.formLocked) {
      this.formLocked = false;
    } else {
      this.error = false;
      this.exists = false;
      this.updateSuccess = false;
      // send service to check name
      const phoneNumber = this.user.phone;
      const userToSave = Object.assign({}, this.user);
      this.authService.updateProfile(userToSave).subscribe(res => {
        if (res) {
          this.exists = false;
          this.updateSuccess = true;
          this.confirmPassword = '';
          this.show = false;
          res.phone = phoneNumber;
          this.user = res;
          this.formLocked = true;
          this.store.dispatch(new authActions.LoginUser(localStorage.getItem('userEmail')));
        }
      },
        err => {
          this.exists = true;
          this.updateSuccess = false;
        }
      );
    }
  }

  getUser() {
    this.authService.getUser(localStorage.getItem('userEmail')).subscribe(res => {
      this.user = res;
      if (this.user.phone) {
        this.user.phone = this.user.phone.substr(this.user.phone.lastIndexOf('#') + 1);
      }
    });
  }

  updatePassword() {
    this.authService.updatePassword(this.oldPassword, this.newPassword).subscribe(res => {
      if (res) {
        this.pwdUpdated = true;
        this.error = false;
      } else {
        this.pwdUpdated = false;
        this.error = true;
      }
    });
  }

  togglePwdSection() {
    this.show = !this.show;
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 50);
  }

  unlockForm() {
    this.formLocked = false;
    this.userToUpdate = Object.assign({}, this.user);
    this.updateSuccess = false;
  }

  cancelUpdate() {
    this.formLocked = true;
    this.user = this.userToUpdate;
    this.updateSuccess = false;
  }


  togglePaymentSection() {
    this.showPaymentForm = !this.showPaymentForm;
    if (this.showPaymentForm === true) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 50);
    }
  }
}
