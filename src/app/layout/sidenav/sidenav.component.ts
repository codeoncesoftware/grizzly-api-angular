import { Component, OnInit } from '@angular/core';
import { APPCONFIG } from '../../config';
import { buildInfo } from '../../../generated/build-info';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  AppConfig;
  buildInfo;
  user: any = {};
  leftDays = 0;
  isBullVisible: boolean = true;


  constructor(private authService: AuthService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.url === '/app/grizzly-ai') {
        this.isBullVisible = false;
      } else {
        this.isBullVisible = true;
      }
    });
  }

  isMenuOpen: boolean = true;

  toggleSidebar() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  ngOnInit() {
    this.AppConfig = APPCONFIG;
    this.buildInfo = buildInfo;
    const email = localStorage.getItem('userEmail');
    this.authService.getUser(email).subscribe(user => {
      this.user = user;
      if (user.accountType === 'FREE') {
        this.leftDays = this.getDaysLeft(user);
      }
    });
  }


  getDaysLeft(user) {
    const registrationDate = new Date(user.registrationDate);
    const expirationDate = registrationDate.setDate(registrationDate.getDate() + 30);
    const x = new Date(expirationDate);
    const today = new Date();
    // eslint-disable-next-line max-len
    return Math.floor((Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / (1000 * 60 * 60 * 24));
  }

  toggleCollapsedNav() {
    this.AppConfig.navCollapsed = !this.AppConfig.navCollapsed;
  }


}
