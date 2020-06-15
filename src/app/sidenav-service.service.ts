import { Injectable } from '@angular/core';
import { MatSidenav} from '@angular/material/sidenav'

@Injectable({
  providedIn: 'root'
})
export class SidenavServiceService {

  constructor() { }

  private sidenav: MatSidenav;
  private appsidenav: any;

	public setExpand(ref) {
		this.appsidenav = ref;
	}

	public toggleExpand(): void {
		this.appsidenav.toggle();
	}

	public setSidenav(sidenav: MatSidenav) {
		this.sidenav = sidenav;
	}

	public open() {
		return this.sidenav.open();
	}


	public close() {
		return this.sidenav.close();
	}

	public toggle(): void {
		this.sidenav.toggle();
	}
}
