import { Injectable } from '@angular/core';
import { Week } from './week';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

@Injectable({ providedIn: 'root' })
export class WeekService {
    private weekUrl = environment.serviceURL + 'weeks';
    constructor(private http: HttpClient) { }

    /** GET game by id. Will 404 if id not found */
    getWeek(season: number, week: number): Observable<Week> {
      const url = `${this.weekUrl}/season/${season}/week/${week}`;
      return this.http.get<Week>(url).pipe(
          tap(_ => console.log(`fetched week week=${week} season=${season}`)),
          catchError(this.handleError<Week>(`fetched week week=${week} season=${season}`))
      );
    }

    getCurrentWeek(): Observable<Week> {
      const url = `${this.weekUrl}/current`;
      return this.http.get<Week>(url).pipe(
          tap(_ => console.log(`fetched current week`)),
          catchError(this.handleError<Week>(`fetched current week`))
      );
    }

  // /**
  //  * Handle Http operation that failed.
  //  * Let the app continue.
  //  * @param operation - name of the operation that failed
  //  * @param result - optional value to return as the observable result
  //  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}