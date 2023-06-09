import { ErrorHandler, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class LoggingService {

    constructor(private errorHandler: ErrorHandler) { }

    log(value: any, ...rest: any[]) {
        if (!environment.production) {
        }
    }

    error(error: Error) {
        this.errorHandler.handleError(error);
    }

    warn(value: any, ...rest: any[]) {
        console.warn(value, ...rest);
    }
}
