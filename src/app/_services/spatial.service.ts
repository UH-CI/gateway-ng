import { Injectable } from '@angular/core';
import { Metadata } from '../_models/metadata';
import { User } from '../_models/user';
import { Observable} from 'rxjs';
import { throwError } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, retry, catchError } from 'rxjs/operators';
import { AppConfig } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SpatialService {

  constructor(private http: HttpClient)  {
  }


  spatialSearch(geometry: any): Observable<Metadata[]>{

    interface ResponseResults {
     result: any
    }
     let query = "geometry="+JSON.stringify(geometry).replace(/"/g,'\'');
     let url = AppConfig.settings.apiServer.agaveChords+"/spatial?"+encodeURI(query);
    console.log(url)
     let head = new HttpHeaders()
     .set("Content-Type", "application/x-www-form-urlencoded");
     let options = {
       headers: head
     };
     console.log("stuff")


    let response = this.http.get<any>(url, options)
     .pipe(
      retry(3),
      map((data) => {
        console.log("more")
        return data.result as Metadata[];
      }),
      catchError((error: any) => {
        console.log(error)
        return throwError(error.statusText);
    }),
    );
    return response;
   }
}
