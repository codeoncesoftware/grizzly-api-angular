import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import * as identityprovider from './../../store/identityprovider/identityprovider.actions'
import { IdentityProviderState } from 'src/app/store/identityprovider/identityprovider.state';

@Injectable()
export class IdentityProviderResolver implements Resolve<any> {
  constructor(private activatedRoute: ActivatedRoute, private store: Store<IdentityProviderState>) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.store.dispatch(new identityprovider.LoadAllIdentityProvider({}));
  }
}
