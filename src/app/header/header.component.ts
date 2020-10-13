import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../_models/user';
import { AppConfig } from '../_services/config.service';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  currentUser: User;
  public tenant = AppConfig.settings.aad.tenant;
  tokenCountdown: number;
  expiration: Date;
  @Input() isExpanded: boolean;
  @Output() toggle = new EventEmitter()


	constructor(
    private router: Router,
    private authenticationService: AuthenticationService
    ) {
      this.authenticationService.currentUser.subscribe( data => {
        this.currentUser = data;
        if (this.currentUser != null){
          if (typeof this.currentUser.expires_at == "string") {
            this.currentUser.expires_at = new Date(this.currentUser.expires_at)
          }
        }
        this.startCountdown();
      });
  }
  toggleActive:boolean = false;

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);

  }

  startCountdown() {
    setInterval(() => this.expiresAt(), 1000);
  }

  expiresAt() {
    if(this.currentUser !== null) {
      var currentDate = new Date();
      var expirationDate = this.currentUser.expires_at;
      var diff = Math.abs((expirationDate.valueOf() - currentDate.valueOf()) / 60000);
      this.tokenCountdown = diff * 60;
      this.expiration = this.currentUser.expires_at;
      if (currentDate.valueOf() > expirationDate.valueOf()) this.logout();
    }
  }

  stringify(countdown: number) {
    countdown = Math.floor(countdown)
    let seconds = countdown % 60;
    let minutes = Math.floor(countdown/60);
    let hours = Math.floor(minutes/60);
    minutes = minutes % 60;

    return hours + " H " + minutes + " M " + seconds + " S";
    
  }

  toggleSidenav() {
    this.toggle.emit();
  }

}
