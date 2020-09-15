import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Pick } from './pick';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StagedPicks } from './staged-picks';
import { User } from '../user/user';
import { WeekPicks } from './week-picks';
import { StarGateService } from '../../services/star-gate/star-gate.service';
import { WeekService } from '../../data-models/week/week.service';
import { Game } from '../game/game';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

@Injectable({ providedIn: 'root' })
export class PickService {
    private picksUrl = environment.picksServiceURL + 'picks';  // URL to web api
    private picks: BehaviorSubject<WeekPicks>;
    private picksByGame: BehaviorSubject<any>;
    private stagedPicks: BehaviorSubject<any>;

    constructor(
      private http: HttpClient,
      private snackBar: MatSnackBar,
      private starGate: StarGateService,
      private weekService: WeekService) { 
          this.picks = new BehaviorSubject<WeekPicks>(JSON.parse(localStorage.getItem('picks')));
          this.picksByGame = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('picksByGame')));
          this.stagedPicks = new BehaviorSubject<StagedPicks>(JSON.parse(localStorage.getItem('stagedPicks')));
      }

    addPicks(picks: Pick[]): Observable<boolean> {
        const url = `${this.picksUrl}/create`;
        return this.http.post(url, picks, httpOptions).pipe(
            map((response) => {
                console.log(`added picks`);
                localStorage.setItem('picksUpdatedDate', new Date().toString());
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
                localStorage.setItem('picksUpdatedDate', new Date().toString());
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
                localStorage.setItem('picksUpdatedDate', new Date().toString());
                return response == 'SUCCESS';
            }),
            catchError(this.handleError<boolean>(`updated picks`))
        );
    }

    getWeekPicksByGame(season:number, seasonType: number, week:number): Observable<any> {
        const url = `${this.picksUrl}/games/season/${season}/seasonType/${seasonType}/week/${week}`;
        if(this.starGate.allowWeek('picksByGame', season, week)) {
            return this.http.get(url, httpOptions).pipe(
                tap((picks: any) => {
                    console.log(`get picks by game`);
                    this.setPicksByGame(season, week, picks);
                }),
                catchError(this.handleError<any>(`get picks by game`))
            );
        } else {
            return this.picksByGame.asObservable();
        }
    }

    getPicksByWeek(user: User, season:number, seasonType: number, week:number): Observable<WeekPicks> {
        const url = `${this.picksUrl}/season/${season}/seasonType/${seasonType}/week/${week}`;
        if(this.starGate.allowWeek('picks', season, week)) {
            return this.http.post(url, user, httpOptions).pipe(
                tap((picks: WeekPicks)  => {
                    console.log(`get picks`);
                    this.setPicks(season, week, picks);
                }),
                catchError(this.handleError<WeekPicks>(`get picks`))
            );
        } else {
            return this.picks.asObservable();
        }

    }

    setPicks(season: number, week: number, picks: any) {
        this.weekService.getCurrentWeek().subscribe(curr => {
            if(curr.week == week && curr.season == season) {
                picks.date = new Date();
                localStorage.setItem('picks', JSON.stringify(picks));
                this.picks.next(picks);
            }
        });
    }

    setPicksByGame(season: number, week: number, picks: any) {
        this.weekService.getCurrentWeek().subscribe(curr => {
            if(curr.week == week && curr.season == season) {
                picks.date = new Date();
                localStorage.setItem('picksByGame', JSON.stringify(picks));
                this.picksByGame.next(picks);
            }
        });
    }

    getUsersPicksByWeek(userId:number, season:number, seasonType: number, week:number): Observable<WeekPicks> {
        const url = `${this.picksUrl}/user/${userId}/season/${season}/seasonType/${seasonType}/week/${week}`;
        return this.http.get(url, httpOptions).pipe(
            tap((picks: WeekPicks)  => console.log(`get picks`)),
            catchError(this.handleError<WeekPicks>(`get picks`))
        );
    }

    setStagedPicks(picks: Pick[]) {
        var stagedPicks = this.stagedPicks.value;

        if( stagedPicks == null) {
            stagedPicks = new StagedPicks();
        }

        stagedPicks.picks = picks;
        this.stagedPicks.next(stagedPicks);
        localStorage.setItem('stagedPicks', JSON.stringify(stagedPicks));
    }

    addStagedPick(selectedPick: Pick) {
        var pickAdded = false;
        var staged = this.getStagedPicks();

        for(var i = 0; i < staged.length; i++) {
          var stagedPick = staged[i];
    
          if(stagedPick.game_id == selectedPick.game_id) {
            pickAdded = true;
            if(stagedPick.team_id == selectedPick.team_id) {
              staged.splice(i, 1);
            } else {
              staged.splice(i, 1, selectedPick);
            }
          }
        }
    
        if(!pickAdded){
            staged.push(selectedPick);
        }

        this.setStagedPicks(staged);
        return staged;
    }

    removeStagedPickPastSumbit(game: Game): number {
        var staged = this.getStagedPicks();

        for(let i = 0; i < staged.length; i++) {
            let pick = staged[i];
            if((pick.game_id == game.game_id) && (new Date(game.pick_submit_by_date) > new Date())){
                return pick.team_id;
            } else if((pick.game_id == game.game_id) && (new Date(game.pick_submit_by_date) <= new Date())){
              staged.splice(i,1);
              this.setStagedPicks(staged);
              return null;
            }
        }
    }

    clearStagedPicks() {
        localStorage.setItem('stagedPicks', null);
    }
    
    getStagedPicks(): Pick[] {
        var picks = this.stagedPicks;
        if(picks.value == null) {
            return [] as Pick[];
        }
        return picks.value.picks;
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