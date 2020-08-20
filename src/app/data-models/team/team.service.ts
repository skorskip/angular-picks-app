import { Injectable } from '@angular/core';
import { Team } from './team';

@Injectable({ providedIn: 'root' })
export class TeamService {

  constructor() { }

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
    if(teamElement) {
      teamElement.classList.remove("selectedTeam");
    }

    var teamInfo = document.getElementById(team.team_id + "-team-info");
    
    if(teamInfo) {
      teamInfo.style.border = "0px";
    }
  }

  highlightSelectTeam(team:Team){
    var teamElement = document.getElementById(team.team_id + "-team-card");
    if(teamElement) {
      teamElement.classList.add("selectedTeam");
    }
    var teamInfo = document.getElementById(team.team_id + "-team-info");
    if(teamInfo) {
      teamInfo.style.border = "solid 2.5px";
    }

  } 
}