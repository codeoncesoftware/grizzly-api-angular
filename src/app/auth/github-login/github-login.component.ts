import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-github-login',
  templateUrl: './github-login.component.html',
  styleUrls: ['./github-login.component.scss']
})
export class GithubLoginComponent implements OnInit {

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
