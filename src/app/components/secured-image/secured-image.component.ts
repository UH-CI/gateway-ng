import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-secured-image',
  templateUrl: './secured-image.component.html',
  styleUrls: ['./secured-image.component.scss']
})
export class SecuredImageComponent implements OnChanges {

  // This code block just creates an rxjs stream from the src
  // this makes sure that we can handle source changes
  // or even when the component gets destroyed
  // So basically turn src into src$
  @Input() private src: string;
  private src$ = new BehaviorSubject(this.src);
  public readonly dataUrl$ = this.src$.pipe(switchMap(url => this.loadImage(url)));
  // we need HttpClient to load the image
  constructor(private httpClient: HttpClient, private domSanitizer: DomSanitizer) {
  }


  ngOnChanges(): void {
    this.src$.next(this.src);
  }



  private loadImage(url: string): Observable<any> {
    return this.httpClient
      // load the image as a blob
      .get(url, {responseType: 'blob'})
      .pipe(
        map(e => this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(e)))
      );
      // create an object url of that blob that we can use in the src attribute

  }

}
