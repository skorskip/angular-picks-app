import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Pick } from './pick';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StagedPicks } from './stagedPicks';
import { PickData } from './pick-data';
import { User } from '../user/user';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

@Injectable({ providedIn: 'root' })
export class PickService {
    private picksUrl = environment.serviceURL + 'picks';  // URL to web api

    constructor(
      private http: HttpClient,
      private snackBar: MatSnackBar) { }

    addPicks(picks: Pick[]): Observable<boolean> {
        const url = `${this.picksUrl}/create`;
        return this.http.post(url, picks, httpOptions).pipe(
            map((response) => {
                console.log(`added picks`);
                return response == 'SUCCESS';
            }),
            catchError(this.handleError<boolean>(`addded picks`))
        );
    }

    deletePick(pickId: number): Observable<boolean> {
        const url = `${this.picksUrl}/${pickId}`;
        return this.http.delete(url, httpOptions).pipe(
            map((response) => {
                console.log(`delete pick`);
                return response == 'SUCCESS';
            }),
            catchError(this.handleError<boolean>('added picks'))
        );
    }
    
    updatePick(pickUpdate:Pick): Observable<boolean> {
        const url = `${this.picksUrl}/${pickUpdate.pick_id}`;
        return this.http.put(url, pickUpdate, httpOptions).pipe(
            map((response) => {
                console.log(`updated picks`);
                return response == 'SUCCESS';
            }),
            catchError(this.handleError<boolean>(`updated picks`))
        );
    }

    getPicksByGame(gameId:number): Observable<PickData[]> {
        const url = `${this.picksUrl}/game/${gameId}`;
        return this.http.get(url, httpOptions).pipe(
            tap((picks: PickData[]) => console.log(`get picks by game`)),
            catchError(this.handleError<PickData[]>(`get picks by game`))
        );
    }

    getPicksByWeek(user: User, season:number, week:number): Observable<Pick[]> {
        const url = `${this.picksUrl}/season/${season}/week/${week}`;
        return this.http.post(url, user, httpOptions).pipe(
            tap((picks: Pick[])  => console.log(`get picks`)),
            catchError(this.handleError<Pick[]>(`get picks`))
        );
    }

    getUsersPicksByWeek(userId:number, season:number, week:number): Observable<Pick[]> {
        const url = `${this.picksUrl}/user/${userId}/season/${season}/week/${week}`;
        return this.http.get(url, httpOptions).pipe(
            tap((picks: Pick[])  => console.log(`get picks`)),
            catchError(this.handleError<Pick[]>(`get picks`))
        );
    }

    getPicks(userId: number): Observable<Pick[]> {
        const url = `${this.picksUrl}/user/${userId}`;
        return this.http.get(url, httpOptions).pipe(
            tap((picks: Pick[])  => console.log(`get user picks`)),
            catchError(this.handleError<Pick[]>(`get user picks`))
        );
    }

    setStagedPicks(picks: Pick[]) {
        var stagedPicks = this.getStagedPicks();

        if( stagedPicks == null) {
            stagedPicks = new StagedPicks();
        }

        stagedPicks.picks = picks;

        localStorage.setItem('stagedPicks', JSON.stringify(stagedPicks));
    }

    clearStagedPicks() {
        localStorage.setItem('stagedPicks', null);
    }
    
    getStagedPicks(): StagedPicks {
        var picks = new BehaviorSubject<StagedPicks>(JSON.parse(localStorage.getItem('stagedPicks')));
        if(picks.value == null) {
            return new StagedPicks();
        }
        return picks.value;
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