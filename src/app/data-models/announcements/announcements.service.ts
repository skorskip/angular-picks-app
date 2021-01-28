import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Announcements } from './announcements';
import { StarGateService } from '../../services/star-gate/star-gate.service';
import { Auth } from 'aws-amplify';

let headers = new HttpHeaders({ 'Content-Type' : 'application/json' });

@Injectable({
  providedIn: 'root'
})
export class AnnouncementsService {
  private announcementsUrl = environment.messageServiceURL + 'message';  // URL to web api
  announcementChange: Subject<boolean> = new Subject<boolean>();
  announcementSelected =false;
  private announcements: BehaviorSubject<Announcements>;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private stargate: StarGateService) { 
      this.announcementChange.subscribe((value) => {
        this.announcementSelected = value
      });

      this.announcements = new BehaviorSubject<Announcements>(JSON.parse(localStorage.getItem("announcements")));
      headers = headers.set('Authorization', localStorage.getItem("token"));
    }

  getAnnoucements(): Observable<Announcements> {
    const url = `${this.announcementsUrl}/announcements`;
    
    if(this.stargate.allow('announcements')){
      var request = {} as any;
      request.lastCheckDate = this.getAnnouncementCheck();
  
      return this.http.post(url, request, {'headers' : headers}).pipe(
        tap((announcements: Announcements) => {
          console.log(`fetched announcements`);
          announcements.date = new Date();
          localStorage.setItem("announcements", JSON.stringify(announcements));
          this.announcements.next(announcements);
        }),
        catchError(this.handleError<Announcements>(`fetched announcements`))
      );
    } else {
      return this.announcements.asObservable();
    }
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
        return null;
      }
      return annnouncementDate;
  }

  setAnnouncements(data: Announcements) {
    localStorage.setItem("announcements", JSON.stringify(data));
  }

  // /**
  //  * Handle Http operation that failed.
  //  * Let the app continue.
  //  * @param operation - name of the operation that failed
  //  * @param result - optional value to return as the observable result
  //  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackBar.open('There was a failure, please try again later.','', {duration:3000, panelClass: ["failure-snack", "quaternary-background", "secondary"]});

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
