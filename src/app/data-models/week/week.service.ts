import { Injectable } from '@angular/core';
import { Week } from './week';
import { CurrentWeek } from './current-week';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../user/user';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

@Injectable({ providedIn: 'root' })
export class WeekService {
    currentWeek = null;
    private weekUrl = environment.weekServiceURL + 'week';
    
    constructor(
      private http: HttpClient,
      private snackBar: MatSnackBar) { }

    /** GET game by id. Will 404 if id not found */
    getWeek(season: number, week: number, user: User): Observable<Week> {
      const url = `${this.weekUrl}/season/${season}/week/${week}`;
      return this.http.post(url, user, httpOptions).pipe(
          tap((weekResponse: Week) => console.log(`fetched week week=${week} season=${season}`)),
          catchError(this.handleError<Week>(`fetched week week=${week} season=${season}`))
      );
    }

    getCurrentWeek(): Observable<CurrentWeek> {
      const url = `${this.weekUrl}/current`;
      if(this.currentWeek == null) {
        this.currentWeek = this.http.get<CurrentWeek>(url).pipe(
          tap(_ => console.log(`fetched current week`)),
          catchError(this.handleError<Week>(`fetched current week`))
        );
      } 

      return this.currentWeek;
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