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
    private weeks:Week[] = [
        {
            'id':106,
            'number': 6,
            'games' : [101, 102, 103, 104, 105, 106, 107, 108, 109],
            'teams' : [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
            'date' : 'SUN, OCT 8, 2018'
        },
        {
            'id':105,
            'number': 5,
            'games' : [101, 102, 103, 104, 105, 106, 107, 108, 109],
            'teams' : [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
            'date' : 'SUN, OCT 8, 2018'
        },
        {
            'id':104,
            'number': 4,
            'games' : [101, 102, 103, 104, 105, 106, 107, 108, 109],
            'teams' : [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
            'date' : 'SUN, OCT 8, 2018'
        },
        {
            'id':103,
            'number': 3,
            'games' : [101, 102, 103, 104, 105, 106, 107, 108, 109],
            'teams' : [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
            'date' : 'SUN, OCT 8, 2018'
        },
        {
            'id':102,
            'number': 2,
            'games' : [101, 102, 103, 104, 105, 106, 107, 108, 109],
            'teams' : [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
            'date' : 'SUN, OCT 8, 2018'
        },
        {
            'id':101,
            'number': 1,
            'games' : [101, 102, 103, 104, 105, 106, 107, 108, 109],
            'teams' : [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
            'date' : 'SUN, OCT 8, 2018'
        }
    ]
    private week;
    constructor(private http: HttpClient) { }
    
    getWeek(id:number): Week {
        this.weeks.forEach((weekItem) => {
          if(weekItem.id === id){
            this.week = weekItem;
          }
        });
        return this.week;
    }

    getWeeks(): Week[] {
        return this.weeks;
    }

    getCurrentWeek(): Week {
        var maxValue = 0;
        var maxIndex:number = 0;
        this.weeks.forEach((weekItem, i) => {
            if(weekItem.number > maxValue){
                maxValue = weekItem.number;
                maxIndex = weekItem.id;
            }
        });
        return this.getWeek(maxIndex);
    }

    // /** GET game by id. Will 404 if id not found */
    // getWeek(season: number, week: number): Observable<Game> {
    //     const url = `${this.weekUrl}/season/${season}/week/${week}`;
    //     return this.http.get<Game>(url).pipe(
    //         tap(_ => console.log(`fetched week season=${season} week=${week}`)),
    //         catchError(this.handleError<Game>(`getWeek season=${season} week=${week}`))
    //     );
    // }

    // /**
    //  * Handle Http operation that failed.
    //  * Let the app continue.
    //  * @param operation - name of the operation that failed
    //  * @param result - optional value to return as the observable result
    //  */
    // private handleError<T> (operation = 'operation', result?: T) {
    //     return (error: any): Observable<T> => {

    //     // TODO: send the error to remote logging infrastructure
    //     console.error(error); // log to console instead

    //     // TODO: better job of transforming error for user consumption
    //     console.log(`${operation} failed: ${error.message}`);

    //     // Let the app keep running by returning an empty result.
    //     return of(result as T);
    //     };
    // }
}