import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { SidenavServiceService } from '../sidenav-service.service';
import { MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements AfterViewInit {

  @ViewChild('sidenav') public sidenav: MatSidenav;

  @Input() isExpanded: boolean;

	constructor(private sidenavService: SidenavServiceService) {	}

  toggle() {
    this.isExpanded = !this.isExpanded;
    window.dispatchEvent(new Event('resize'));
  }

	ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
    console.log(this.sidenavService)
	}

}
