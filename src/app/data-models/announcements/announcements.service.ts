import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Announcements } from './announcements';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {
  private announcementsUrl = environment.serviceURL + 'message';  // URL to web api
  announcementChange: Subject<boolean> = new Subject<boolean>();
  announcementSelected =false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar) { 
      this.announcementChange.subscribe((value) => {
        this.announcementSelected = value
      });
    }

  getAnnoucements(): Observable<Announcements> {
    const url = `${this.announcementsUrl}/announcements`;

    var request = {} as any;
    request.lastCheckDate = this.getAnnouncementCheck();

    return this.http.post(url, request, httpOptions).pipe(
      tap((announcements: Announcements) => {
        console.log(`fetched announcements`);
      }),
      catchError(this.handleError<Announcements>(`fetched announcements`))
    );
  }

  setAnnouncementCheck(dateChecked: string) {
    this.announcementChange.next(false);
    localStorage.setItem('annoucementCheck', dateChecked);
  }

  clearAnnouncementCheck() {
      localStorage.setItem('annoucementCheck', null);
  }

  getAnnouncementCheck(): String {
      var annnouncementDate = localStorage.getItem('annoucementCheck');
      if(annnouncementDate == null) {
        var d = new Date();
        var day = d.getDay()
        var diff = d.getDate() - day + (day == 0 ? -6:1);
        annnouncementDate = new Date(d.setDate(diff)).toUTCString();
      }
      return annnouncementDate;
  }

  // /**
  //  * Handle Http operation that failed.
  //  * Let the app continue.
  //  * @param operation - name of the operation that failed
  //  * @param result - optional value to return as the observable result
  //  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackBar.open(error.statusText.toLowerCase(),'', {duration:3000});

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
