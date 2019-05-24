import { Injectable } from '@angular/core';
import { Week } from './week';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Game } from '../game/game';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class WeekService {
    private weekUrl = 'localhost:3000/week/';
    private week;
    constructor(private http: HttpClient) { }

    getWeeks(): Week[] {
        return this.weeks;
    }

    /** GET game by id. Will 404 if id not found */
    getWeek(season: number, week: number): Observable<Week> {
        const url = `${this.weekUrl}season/${season}/week/${week}`;
        return this.http.get<Week>(url).pipe(
            tap(_ => console.log(`fetched week season=${season} week=${week}`)),
            catchError(this.handleError<Week>(`getWeek season=${season} week=${week}`))
        );
    }

    getCurrentWeek(): Observable<Week> {
        const url = `${this.weekUrl}current`;
        return this.http.get<Week>(url).pipe(
            tap(_ => console.log(`fetched current week`)),
            catchError(this.handleError<Week>(`getWeek current`))
        );
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
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