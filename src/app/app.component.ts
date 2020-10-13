import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { SidenavServiceService } from './sidenav-service.service';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services/authentication.service';
import { User } from './_models/user';
import { AppConfig } from './_services/config.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  title = 'gateway';
  currentUser: User;
  public tenant = AppConfig.settings.aad.tenant
  public isExpanded = false;

  @ViewChild('appsidenav') private appsidenav: any;

  constructor(private sidenavService: SidenavServiceService) {  }


  ngAfterViewInit() {
    this.sidenavService.setExpand(this.appsidenav);
    console.log(AppConfig.settings.aad.loginURL);
  }

  toggle(): void {
    this.isExpanded = !this.isExpanded;
  }
}
