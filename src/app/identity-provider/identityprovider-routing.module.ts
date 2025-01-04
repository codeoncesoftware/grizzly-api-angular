import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdentityproviderDetailsComponent } from './identityprovider-details/identityprovider-details.component';
import { ActiveIdentityProviderResolver } from '../shared/resolvers/active-identityprovider.resolver';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: ':id',
    component: IdentityproviderDetailsComponent,
    resolve: { active: ActiveIdentityProviderResolver },
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ActiveIdentityProviderResolver]
})
export class IdentityProviderRoutingModule { }
