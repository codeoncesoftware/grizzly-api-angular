import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IdentityproviderDetailsComponent } from './identityprovider-details/identityprovider-details.component';
import { ActiveIdentityProviderResolver } from '../shared/resolvers/active-identityprovider.resolver';

const routes: Routes = [
  {
    path: ':id',
    component: IdentityproviderDetailsComponent,
    resolve: {active : ActiveIdentityProviderResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ActiveIdentityProviderResolver]
})
export class IdentityProviderRoutingModule { }
