import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Game } from './game';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class GameService {
  private gamesUrl = environment.serviceURL + 'games';  // URL to web api

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar) { }

  // /** GET game by id. Will 404 if id not found */
  getGame(id: number): Observable<Game> {
    const url = `${this.gamesUrl}/${id}`;
    return this.http.get<Game>(url).pipe(
      tap(_ => console.log(`fetched game id=${id}`)),
      catchError(this.handleError<Game>(`getGame id=${id}`))
    );
  }

  getGameLocal(id: number, games: Game[]): Game {
    var game
    games.forEach((gameItem) => {
      if(id == gameItem.game_id){
        game = gameItem;
      }
    })
    return game;
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