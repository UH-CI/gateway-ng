import { Component, OnInit, Input } from '@angular/core';
import { DrawerComponent } from './drawer/drawer.component';

@Component({
  selector: 'app-layouts',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  // @Input() sideNav: DrawerComponent;
  constructor() { }

  ngOnInit() {
  }

}