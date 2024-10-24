import { HttpHeaders } from '@angular/common/http';
import { Route } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Card } from 'src/app/shared/models/Card';
import { AppTranslateService } from 'src/app/shared/services/app-translate-service';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  isFr: boolean;
  selectedLanguage: string;
   price;
  errorMessage = '';
  error = false;
  email: string;
  cardType: string;
  country: string;
  cardId: string;
  paymentSuccess = false;
  showSpinner = false;
  cardDetails = new Card();
  validCard = true;
  expireValidity = true;
  cvcValidity = true;
  type = '';
  constructor(private appTranslateService: AppTranslateService ,  private toaster: ToastrService, private paymentService: PaymentService , private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.type = this.router.snapshot.paramMap.get('type');
    this.price = this.type === 'limitless' ? '5000' : '290';
       // Set i18n Language
    if (localStorage.getItem('grizzly-lang')) {
        this.setLang(localStorage.getItem('grizzly-lang').toLowerCase());
      } else {
        this.setLang(navigator.language);
      }
  }
  setLang(lang: string) {

    this.appTranslateService.setDefaultLang(lang);
    localStorage.setItem('grizzly-lang', lang);

    if (lang.includes('fr')) {
      this.selectedLanguage = 'FR';
      this.isFr = false;
    } else {
      this.selectedLanguage = 'EN';
      this.isFr = true;
    }

  }

}
