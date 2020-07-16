import { Component, OnInit } from '@angular/core';
import { SidenavServiceService } from '../sidenav-service.service';

import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user';
import { AppConfig } from '../_services/config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  currentUser: User;
  public tenant = AppConfig.settings.aad.tenant
  
	constructor(
    private sidenav: SidenavServiceService,
    private router: Router,
    private authenticationService: AuthenticationService
    ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
  toggleActive:boolean = false;

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  toggleRightSidenav() {
    this.toggleActive = !this.toggleActive;
    this.sidenav.toggleExpand();

    console.log('Clicked');
  }

}
