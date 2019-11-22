import { Injectable } from '@angular/core';
import { Team } from './team';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class TeamService {

  private teamUrl = environment.serviceURL +'teams';  // URL to web api

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar) { }

  getTeamByIds (teamIds:number[]): Observable<Team[]> {
    const url = `${this.teamUrl}`;
    return this.http.post(url, teamIds, httpOptions).pipe(
      tap((newTeams: Team[]) => console.log(`fetched teams`)),
      catchError(this.handleError<Team[]>(`fetched teams`))
    );
  }

  /** GET game by id. Will 404 if id not found */
  getTeam (id: number): Observable<Team> {
    const url = `${this.teamUrl}/${id}`;
    return this.http.get<Team>(url).pipe(
        tap(_ => console.log(`fetched team team=${id}`)),
        catchError(this.handleError<Team>(`fetched team team=${id}`))
    );
  }

  unSelectTeam(selectedTeam:Team){
    var team = document.getElementById(selectedTeam.team_id + "-team-card");
    team.style.backgroundColor = "";
    team.style.color = selectedTeam.primary_color;
    team.classList.add("base-background")
    team.classList.remove("selectedTeam");

    // team.classList.remove('selectedTeam');
    // team.classList.remove('secondary-background');
    // team.classList.remove('base');
    // team.classList.add('secondary');
    // team.classList.add('base-background');
  }

  highlightSelectTeam(team:Team){
    var teamElement = document.getElementById(team.team_id + "-team-card");
    teamElement.classList.remove("base-background");
    teamElement.style.background = team.primary_color;
    teamElement.style.color = "white";
    teamElement.classList.add("selectedTeam"); 

    // teamElement.classList.remove('secondary');
    // teamElement.classList.remove('base-background');
    // teamElement.classList.add('selectedTeam');
    // teamElement.classList.add('secondary-background');
    // teamElement.classList.add('base');
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