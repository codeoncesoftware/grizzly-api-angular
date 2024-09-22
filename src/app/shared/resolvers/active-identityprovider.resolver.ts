import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class ActiveIdentityProviderResolver implements Resolve<any> {

    // To check if it is already set and ignore state refresh
    isSet = false;

    constructor() { }

    resolve(route: ActivatedRouteSnapshot): any {
        this.isSet = false;
    }
}
