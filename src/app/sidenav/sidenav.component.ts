import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SidenavServiceService } from '../sidenav-service.service';
import { MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements AfterViewInit {

  @ViewChild('sidenav') public sidenav: MatSidenav;

  public isExpanded: boolean = false;

	constructor(private sidenavService: SidenavServiceService) {	}

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

	ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
    console.log(this.sidenavService)
	}

}
