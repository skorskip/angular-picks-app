import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StarGateService } from '../../services/star-gate/star-gate.service';
import { League } from './league';
import { Auth } from 'aws-amplify';

let headers = new HttpHeaders({ 'Content-Type' : 'application/json' });

@Injectable({
  providedIn: 'root'
})
export class LeagueService {
  private leagueUrl = environment.leagueServiceURL + 'league';  // URL to web api
  private settings: BehaviorSubject<League>;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private starGate: StarGateService
    ) { 
      this.settings = new BehaviorSubject<League>(JSON.parse(localStorage.getItem("settings")));
      headers = headers.set('Authorization', localStorage.getItem("token"));
    }

    getLeagueSettings(): Observable<League> {
      const url = `${this.leagueUrl}/settings`;
      if(this.starGate.allow('settings')) {
        return this.http.get(url, {'headers' : headers}).pipe(
            tap((league: League) => {
              console.log(`get settings`);
              league.date = new Date();
              localStorage.setItem("settings", JSON.stringify(league));
              this.settings.next(league);
            }),
            catchError(this.handleError<League>(`get settings`))
        );
      }
      else {
        return this.settings.asObservable();
      }
    }


  // /**
  //  * Handle Http operation that failed.
  //  * Let the app continue.
  //  * @param operation - name of the operation that failed
  //  * @param result - optional value to return as the observable result
  //  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

        this.snackBar.open('There was failure, please try again later.','', {duration:3000, panelClass:["failure-snack", "quaternary-background", "secondary"]});

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
