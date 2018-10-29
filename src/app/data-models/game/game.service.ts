import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Game } from './game';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable({ providedIn: 'root' })
export class GameService {

  private gamesUrl = 'api/games';  // URL to web api
  private games: Game[] = [
    {
      id: 101,
      number: 101,
      date: 'SUN, OCT 10 @ 04:00PM',
      submitDate: 'SUN, OCT 10 @ 03:00PM',
      homeTeam: 101,
      awayTeam: 102,
      homeScore: 21,
      awayScore: 7,
      spread: 7.0,
      progress: 'FINAL'
    },
    {
      id: 102,
      number: 102,
      date: 'SUN, OCT 10 @ 04:00PM',
      submitDate: 'SUN, OCT 10 @ 03:00PM',
      homeTeam: 103,
      awayTeam: 104,
      homeScore: 0,
      awayScore: 0,
      spread: 6.0,
      progress: 'INPROGRESS'
    },
    {
      id: 103,
      number: 103,
      date: 'SUN, OCT 10 @ 04:00PM',
      submitDate: 'SUN, OCT 10 @ 03:00PM',
      homeTeam: 105,
      awayTeam: 106,
      homeScore: 0,
      awayScore: 0,
      spread: -3.0,
      progress: 'PENDING'
    },
    {
      id: 104,
      number: 104,
      date: 'SUN, OCT 10 @ 04:00PM',
      submitDate: 'SUN, OCT 10 @ 03:00PM',
      homeTeam: 107,
      awayTeam: 108,
      homeScore: 0,
      awayScore: 0,
      spread: -3.0,
      progress: 'PENDING'
    },
    {
      id: 105,
      number: 105,
      date: 'SUN, OCT 10 @ 04:00PM',
      submitDate: 'SUN, OCT 10 @ 03:00PM',
      homeTeam: 109,
      awayTeam: 110,
      homeScore: 0,
      awayScore: 0,
      spread: -3.0,
      progress: 'PENDING'
    },
    {
      id: 106,
      number: 106,
      date: 'SUN, OCT 10 @ 04:00PM',
      submitDate: 'SUN, OCT 10 @ 03:00PM',
      homeTeam: 111,
      awayTeam: 112,
      homeScore: 0,
      awayScore: 0,
      spread: -3.0,
      progress: 'PENDING'
    },
    {
      id: 107,
      number: 107,
      date: 'SUN, OCT 10 @ 04:00PM',
      submitDate: 'SUN, OCT 10 @ 03:00PM',
      homeTeam: 113,
      awayTeam: 114,
      homeScore: 0,
      awayScore: 0,
      spread: -3.0,
      progress: 'PENDING'
    },
    {
      id: 108,
      number: 109,
      date: 'SUN, OCT 10 @ 04:00PM',
      submitDate: 'SUN, OCT 10 @ 03:00PM',
      homeTeam: 115,
      awayTeam: 116,
      homeScore: 0,
      awayScore: 0,
      spread: -3.0,
      progress: 'PENDING'
    },
    {
      id: 109,
      number: 109,
      date: 'SUN, OCT 10 @ 04:00PM',
      submitDate: 'SUN, OCT 10 @ 03:00PM',
      homeTeam: 117,
      awayTeam: 118,
      homeScore: 0,
      awayScore: 0,
      spread: -3.0,
      progress: 'PENDING'
    }
  ];

  private gameByIds: Game[] = [];

  constructor(
    private http: HttpClient) { }

  /** GET games from the server */
  getGames (): Game[] {
    return this.games;
  }

  getGameByIds (gameIds:number[]): Game[] {
    this.gameByIds = [];
    gameIds.forEach((gameId)=>{
      this.games.forEach((gameItem) => {
          if(gameItem.id == gameId){
              this.gameByIds.push(gameItem);
          }
        });
    })
    return this.gameByIds;
  }

  // /** GET game by id. Will 404 if id not found */
  // getGame(id: number): Observable<Game> {
  //   const url = `${this.gamesUrl}/${id}`;
  //   return this.http.get<Game>(url).pipe(
  //     tap(_ => console.log(`fetched game id=${id}`)),
  //     catchError(this.handleError<Game>(`getGame id=${id}`))
  //   );
  // }

  // //////// Save methods //////////

  // /** PUT: update the game on the server */
  // updateGame (game: Game): Observable<any> {
  //   return this.http.put(this.gamesUrl, game, httpOptions).pipe(
  //     tap(_ => console.log(`updated game id=${game.id}`)),
  //     catchError(this.handleError<any>('updateGame'))
  //   );
  // }

  // /**
  //  * Handle Http operation that failed.
  //  * Let the app continue.
  //  * @param operation - name of the operation that failed
  //  * @param result - optional value to return as the observable result
  //  */
  // private handleError<T> (operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {

  //     // TODO: send the error to remote logging infrastructure
  //     console.error(error); // log to console instead

  //     // TODO: better job of transforming error for user consumption
  //     console.log(`${operation} failed: ${error.message}`);

  //     // Let the app keep running by returning an empty result.
  //     return of(result as T);
  //   };
  // }
}