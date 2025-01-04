import { Route } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sso-login',
  templateUrl: './sso-login.component.html',
  styleUrls: ['./sso-login.component.scss']
})
export class SsoLoginComponent implements OnInit {

  dots = '.';

  constructor(private route: ActivatedRoute , private router: Router  , private authService: AuthService) { }

  ngOnInit(): void {
    this.displayFetchingDots();

    this.route.queryParams
    .subscribe(params => {
     if(params.token) {
         localStorage.setItem('token' , params.token);
         localStorage.setItem('anonymos' , 'false');
         localStorage.setItem('userEmail' , params.userEmail);
         this.router.navigate(['/app/dashboard']);
     }
    });
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
