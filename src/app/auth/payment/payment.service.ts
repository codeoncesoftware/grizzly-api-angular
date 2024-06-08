import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient, private router: Router, private translateService: TranslateService) { }
  chargePlan(x) {
    return this.http.post(environment.baseUrl + '/payment/charge', {}, { headers: x });
  }
  subscribePlan(x) {
    return this.http.post(environment.baseUrl + '/payment/subscribe', {}, { headers: x });
  }
  savePlan(paymentDto) {
    return this.http.post(environment.baseUrl + '/payment/save', paymentDto);
  }
}
