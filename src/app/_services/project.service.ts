import { Injectable } from '@angular/core';
import { Site } from '../_models/site';
import { Project } from '../_models/project';
//import { Sites } from './sites';
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
export class ProjectService {
  private projectUrl = AppConfig.settings.apiServer.agaveChords +'/projects';  // URL to web api

  constructor(private http: HttpClient,
    private messageService: MessageService)  {
  }

  getProjects(): Observable<Project[]> {
    //fetch Sites from Agave Chords API
    //return this.http.get<Site[]>(this.siteUrl)

    let head = new HttpHeaders()
    .set("Content-Type", "application/json");
  //  .set('Access-Control-Allow-Origin','*');
    let options = {
      headers: head
    };

    let response = this.http.get<ResponseResults>(this.projectUrl, options)
    .pipe(
      retry(3),
      map((data) => {
        return data.result as Project[];
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
  getProject(project): Observable<Project> {
    //fetch Sites from Agave Chords API
    //return this.http.get<Site[]>(this.siteUrl)

    let head = new HttpHeaders()
    .set("Content-Type", "application/json");
  //  .set('Access-Control-Allow-Origin','*');
    let options = {
      headers: head
    };

    let response = this.http.get<ResponseResults>(this.projectUrl, options)
    .pipe(
      retry(3),
      map((data) => {
        return data.result as Project;
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

  createProject(form:JSON): Observable<Project> {
    let head = new HttpHeaders()
    .set("Content-Type", "application/json");
  //  .set('Access-Control-Allow-Origin','*');
    //var formData = form;
    console.log(form)
    var url = this.projectUrl
    let options = form
    // {
    //   headers: head,
    //   body: form
    // };

    let response = this.http.post<ResponseResults>(url, options)
    .pipe(
      retry(3),
      map((data) => {
        return data.result as Project;
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
