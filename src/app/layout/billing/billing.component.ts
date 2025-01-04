import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/store/authentication/auth.state';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  constructor(private store: Store<AuthState>,) { }
  user;
  ngOnInit(): void {
    this.store.select<any>('auth').subscribe(state => {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.user = state['user'];
    });
  }



}
