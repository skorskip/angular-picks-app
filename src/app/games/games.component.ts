import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Game } from '../data-models/game/game';
import { Team } from '../data-models/team/team';  
import { GameService } from '../data-models/game/game.service';
import { TeamService } from '../data-models/team/team.service';
import { ICON_REGISTRY_PROVIDER } from '@angular/material';
import { MatDialog } from '@angular/material';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
	
  @Input() games: Game[];
  @Input() teams: Team[];
  @Input('submitOpened') submitOpened: boolean;
  @Output() openSubmit = new EventEmitter<boolean> ();
  constructor(private gameService: GameService, private teamService: TeamService, @Inject(DOCUMENT) document) { }

  ngOnInit() {}

  getBorderColor(id:number) {
    var team = this.getTeam(id);
    var shadowColor = team.secondaryColor.substring(0, team.secondaryColor.lastIndexOf("1")) + ".7)"
    return {
      'border-color' : team.primaryColor,
      'box-shadow': '0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px ' + shadowColor
    }
  }

  selectTeam(teamId:number, gameId:number) {
    document.getElementById(gameId + "-game-card").classList.add("selectedGame");
    var team = this.getTeam(teamId);
    var game = this.getGame(gameId);
    var otherTeamId = game.homeTeam == teamId ? game.awayTeam : game.homeTeam;
    var teamElement = document.getElementById(teamId + "-team-card");
    var otherTeamElement = document.getElementById(otherTeamId + "-team-card");
    this.openSubmit.emit(true);
    if(teamElement.classList.contains("selectedTeam")){
      this.unSelectTeam(teamId);
      document.getElementById(gameId + "-game-card").classList.remove("selectedGame");
    } else if(otherTeamElement.classList.contains("selectedTeam")){
      this.unSelectTeam(otherTeamId);
      this.highlightSelectTeam(team);
    } else {
      this.highlightSelectTeam(team);
    }
  }

  unSelectTeam(teamId:number){
    var team = document.getElementById(teamId + "-team-card");
    team.style.backgroundColor = "white";
    team.style.color = "";
    team.classList.remove("selectedTeam");
  }

  highlightSelectTeam(team:Team){
    var teamElement = document.getElementById(team.id + "-team-card");
    teamElement.style.backgroundColor = team.primaryColor;
    teamElement.style.color = "white";
    teamElement.classList.add("selectedTeam");
  }

  getTeamName(id:number) {
    var team = this.getTeam(id);
    return team.abbrevation;
  }

  getTeam(id: number): Team {
    var team
    this.teams.forEach((teamItem) => {
      if(id == teamItem.id){
        team = teamItem;
      }
    })
    return team;
  }

  getGame(id : number): Game {
    var game
    this.games.forEach((gameItem) => {
      if(id == gameItem.id){
        game = gameItem;
      }
    })
    return game;
  }
}

