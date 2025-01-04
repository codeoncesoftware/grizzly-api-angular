import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordResolver } from '../shared/resolvers/reset-password.resolver';
import { FreeTrialExpiredComponent } from './free-trial-expired/free-trial-expired.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'trial-expired', component: FreeTrialExpiredComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'reset/:token', component: ResetPasswordComponent, resolve: { active: ResetPasswordResolver } }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
  providers: [ResetPasswordResolver]
})
export class AuthRoutingModule { }
