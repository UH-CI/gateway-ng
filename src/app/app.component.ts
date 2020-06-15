import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { SidenavServiceService } from './sidenav-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  title = 'gateway';

  @ViewChild('appsidenav') private appsidenav: any;

  constructor(private sidenavService: SidenavServiceService) {
    
  }

  ngAfterViewInit() {
    this.sidenavService.setExpand(this.appsidenav);
  }
}
