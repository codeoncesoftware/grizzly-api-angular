import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private injector: Injector, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


        if (this.router.url.includes('/editor') || this.router.url === '/') {
            if (!request.url.includes('swagger.io')) {
                const apiKey = environment.apiKey;
                if (this.router.url.includes('/editor')) {
                    // localStorage.removeItem('token');
                    request = request.clone({
                        headers: request.headers.delete('Authorization')
                    });
                }
                request = request.clone({
                    headers: request.headers.set('apiKey', apiKey)
                });
            }
        } else {
            // set token if it exists
            // set token if it exists
        if (localStorage.getItem('token')) {
            // if(!request.url.includes('/api/check/user')) {
                request = request.clone({
                    headers: request.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
                });
           //  }
        }
        }
        if (this.router.url === '/' && localStorage.getItem('token')) {
            request = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
            });
        }


        // handle response status
        return next.handle(request)
            .pipe(
                catchError((err) => {
                    const toastr = this.injector.get(ToastrService);
                    if (err.status === 302) {
                        // Resource found but it is DUPLICATED
                    } else if (err.status === 400) {

                    } else if (err.status === 401) {
                        if (err.error.error === 'invalid_token' || err.error.error === 'unauthorized') {
                            localStorage.removeItem('userEmail');
                            localStorage.removeItem('token');
                            if(!this.router.url.includes('/editor')) {
                                this.router.navigate(['/login']);
                                // window.location.href =  environment.loginUrl;
                            }
                        }
                    } else if (err.status === 404) {

                        if (!this.router.url.includes('/editor')) {
                            this.router.navigate(['/app/dashboard']);
                        }
                    }  else if (err.status === 403) {
                        toastr.error('', 'RESOURCE NOT AUTHORIZED', {
                            tapToDismiss: true,
                        });
                        // window.location.href =  environment.loginUrl;

                    } else if (err.status === 406) {
                        if (err.error && err.error === 4061) {
                            // Wrong DataSource Details
                        } else {
                            // Transformation with no XML Content
                            toastr.error(err.error, '', {
                                tapToDismiss: true,
                                positionClass: 'toast-top-left',
                                progressBar: true,
                            });
                        }

                    } else { // SERVER ERROR 5**
                        toastr.error('Please try again later', 'OOPS, SOMETHING WENT WRONG!', {
                            tapToDismiss: true,
                            positionClass: 'toast-top-full-width',
                            progressBar: true,
                        });
                    }
                    return throwError(err);
                })
            );
    }
}
