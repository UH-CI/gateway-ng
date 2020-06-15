import { Component, OnInit } from '@angular/core';
import { SidenavServiceService } from '../sidenav-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

	constructor(private sidenav: SidenavServiceService) {

  }
  toggleActive:boolean = false;

  toggleRightSidenav() {
    this.toggleActive = !this.toggleActive;
    this.sidenav.toggleExpand();

    console.log('Clicked');
  }

}
