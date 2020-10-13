import { Injectable } from '@angular/core';
import { Variable } from '../_models/variable';
import { Instrument } from '../_models/instrument';
//import { Variables } from './Variables';
import { Observable, of } from 'rxjs';
import { throwError } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, retry, catchError } from 'rxjs/operators';
import { AppConfig } from './config.service';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class VariableService {
  private variableUrl = AppConfig.settings.apiServer.agaveChords +'/variables';  // URL to web api

  constructor(private http: HttpClient,
    private messageService: MessageService)  {
  }

  getVariables(instrument: Instrument): Observable<Variable[]> {
    //fetch Variables from Agave Chords API
    let head = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
    let options = {
      headers: head
    };

    let response = this.http.get<ResponseResults>(this.variableUrl+'?instrument_uuid='+instrument.uuid, options)
    .pipe(
      retry(3),
      map((data) => {
        return data.result as Variable[];
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

  createVariable(form:JSON): Observable<Variable> {
    let head = new HttpHeaders()
    .set("Content-Type", "application/x-www-form-urlencoded");
  //  .set('Access-Control-Allow-Origin','*');
    //var formData = form;
    console.log(form)
    var url = this.variableUrl + '?name='+form['name']+'&instrument_uuid='+form['instrument_uuid']+'&shortname='+form['shortname']+'&units='+form['units']+'&units_abbrv='+form['units_abbrv']
    let options = {
      headers: head,
    };

    let response = this.http.post<ResponseResults>(url, options)
    .pipe(
      retry(3),
      map((data) => {
        return data.result as Variable;
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
