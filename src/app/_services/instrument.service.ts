import { Injectable } from '@angular/core';
import { Instrument } from '../_models/instrument';
import { MessageService } from './message.service';
import { Observable} from 'rxjs';
import { throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, retry, catchError } from 'rxjs/operators';
import { AppConfig } from './config.service';



@Injectable({
  providedIn: 'root'
})
export class InstrumentService {
  private instrumentUrl = AppConfig.settings.apiServer.agaveChords + '/instruments';  // URL to web api
  private testSiteUUID = '1940996399071695336-242ac1111-0001-012';

  constructor(private http: HttpClient){
    //private messageService: MessageService)  {
  }

  getInstruments(): Observable<Instrument[]> {
    //fetch Instrument from Agave Chords API
    interface ResponseResults {
     result: any
    }
    console.log('getting instruments')
    let head = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
    let options = {
      headers: head
    };

    let response = this.http.get<any>(this.instrumentUrl, options)
     .pipe(
      retry(3),
      map((data) => {
        console.log("more")
        return data.result as Instrument[];
      }),
      catchError((error: any) => {
        console.log(error)
        return throwError(error.statusText);
      }),
    );
    return response;
  }

  getInstrumentsBySite(site): Observable<Instrument[]> {
    //fetch Instrument from Agave Chords API
    let head = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
    let options = {
      headers: head
    };

    let response = this.http.get<ResponseResults>(this.instrumentUrl+'?site_uuid='+site.uuid, options)
    .pipe(
      retry(3),
      map((data) => {
        return data.result as Instrument[];
      }),
      catchError((error: any) => {
        console.log(error)
        return throwError(error.statusText);
      })
    );
    return response;
    interface ResponseResults {
      result: any
    }
  }

  createInstrument(form:JSON): Observable<Instrument> {
    let head = new HttpHeaders()
    .set("Content-Type", "application/x-www-form-urlencoded");
  //  .set('Access-Control-Allow-Origin','*');
    //var formData = form;
    console.log(form)
    var url = this.instrumentUrl + '?name='+form['name']+'&site_uuid='+form['site_uuid']
    let options = {
      headers: head,
    };

    let response = this.http.post<ResponseResults>(url, options)
    .pipe(
      retry(3),
      map((data) => {
        return data.result as Instrument;
      }),
      catchError((error: any) => {
        console.log(error)
        return throwError(error.statusText);
      })
    );
    return response;
    interface ResponseResults {
      result: any
    }
  }
}
