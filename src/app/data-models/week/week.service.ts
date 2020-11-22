import { Injectable } from '@angular/core';
import { Week } from './week';
import { CurrentWeek } from './current-week';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../user/user';
import { StarGateService } from '../../services/star-gate/star-gate.service';
import { Auth } from 'aws-amplify';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

@Injectable({ providedIn: 'root' })
export class WeekService {
    private weekUrl = environment.weekServiceURL + 'week';
    private currentWeek: BehaviorSubject<CurrentWeek>;
    private week: BehaviorSubject<Week>;
    private authToken;
    
    constructor(
      private http: HttpClient,
      private snackBar: MatSnackBar,
      private starGate: StarGateService) { 
        this.currentWeek = new BehaviorSubject<CurrentWeek>(JSON.parse(localStorage.getItem("currentWeek")));
        this.week = new BehaviorSubject<Week>(JSON.parse(localStorage.getItem("week")));
        Auth.currentSession().then(result => {
          this.authToken = result.getIdToken();
          httpOptions.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization' : this.authToken});
        });
      }

    /** GET game by id. Will 404 if id not found */
    getWeek(season: number, seasonType: number, week: number, user: User): Observable<Week> {
      const url = `${this.weekUrl}?season=${season}&seasonType=${seasonType}&week=${week}`;
      if (this.starGate.allowWeek("week", season, week)) {
        return this.http.post(url, user, httpOptions).pipe(
          tap((weekResponse: Week) => {
            console.log(`fetched week week=${week} season=${season}`);
            this.setWeek(season, week, weekResponse);
          }),
          catchError(this.handleError<Week>(`fetched week week=${week} season=${season}`))
        );
      } else {
        return this.week.asObservable();
      }

    }

    getCurrentWeek(): Observable<CurrentWeek> {
      const url = `${this.weekUrl}/current`;
      if(this.starGate.allow("currentWeek")) {
        return this.http.get<CurrentWeek>(url).pipe(
          tap((currentWeek: CurrentWeek) => {
            console.log(`fetched current week`);
            currentWeek.date = new Date();
            localStorage.setItem("currentWeek", JSON.stringify(currentWeek));
            this.currentWeek.next(currentWeek);
          }),
          catchError(this.handleError<CurrentWeek>(`fetched current week`))
        );
      } else {
        return this.currentWeek.asObservable();
      }
    }

  setWeek(season: number, week: number, weekObject: Week) {
    this.getCurrentWeek().subscribe(curr => {
        if(curr.week == week && curr.season == season) {
            weekObject.date = new Date();
            localStorage.setItem('week', JSON.stringify(weekObject));
            this.week.next(weekObject);
        }
    });
  }

  // /**
  //  * Handle Http operation that failed.
  //  * Let the app continue.
  //  * @param operation - name of the operation that failed
  //  * @param result - optional value to return as the observable result
  //  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.snackBar.open(error.message,'', {duration:3000,panelClass:["failure-snack", "quaternary-background", "secondary"]});

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}