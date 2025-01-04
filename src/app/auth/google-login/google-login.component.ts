import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss']
})
export class GoogleLoginComponent  implements OnInit{

  dots = '.';

  constructor() { }

  ngOnInit() {
    this.displayFetchingDots();
  }

  public displayFetchingDots() {
    if (this.dots.length > 4) {
      this.dots = '.';
    } else {
      this.dots = this.dots + '.';
    }
    setTimeout(() => this.displayFetchingDots(), 500);

    return this.dots;
  }

}
