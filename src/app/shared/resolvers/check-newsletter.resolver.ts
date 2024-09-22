import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CheckNewsletterResolver implements Resolve<any> {
    constructor(private authService: AuthService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): any {
       return this.authService.checkNewsletter(route.params.userEmail).subscribe(() => {
           this.router.navigateByUrl('/login');
       });
    }
}
