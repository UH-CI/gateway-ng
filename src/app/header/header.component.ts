import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  @Input() isExpanded: boolean;
  @Output() toggle = new EventEmitter()


	constructor(
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

  toggleSidenav() {
    this.toggle.emit();
  }

}
