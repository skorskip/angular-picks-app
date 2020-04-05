import { Injectable } from '@angular/core';
import { Team } from './team';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class TeamService {

  private teamUrl = environment.serviceURL +'teams';  // URL to web api

  constructor(
    private snackBar: MatSnackBar) { }

  getTeamLocal (id: number, teams: Team[]): Team {
    var team
    teams.forEach((teamItem) => {
      if(id == teamItem.team_id){
        team = teamItem;
      }
    })
    return team;
  }

  unSelectTeam(team:Team){
    var teamElement = document.getElementById(team.team_id + "-team-card");

    teamElement.classList.add("base-background");
    teamElement.classList.remove("selectedTeam");
    teamElement.classList.remove("base");
    teamElement.classList.remove(team.display_color + "-background");
    teamElement.style.border = "solid 1px";
  }

  highlightSelectTeam(team:Team){
    var teamElement = document.getElementById(team.team_id + "-team-card");

    teamElement.classList.add(team.display_color + "-background");
    teamElement.classList.add("base");
    teamElement.classList.remove("base-background");
    teamElement.classList.add("selectedTeam");
    teamElement.style.border = "0px";
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