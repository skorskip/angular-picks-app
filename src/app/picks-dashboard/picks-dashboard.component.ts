import { Component, OnInit, Inject } from '@angular/core';
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
  selector: 'app-picks-dashboard',
  templateUrl: './picks-dashboard.component.html',
  styleUrls: ['./picks-dashboard.component.css']
})
export class PicksDashboardComponent implements OnInit {
	
  games: Game[] = [];
  teams: Team[] = [];
  selectedTeam;
  submitOpened = false;
  constructor(private gameService: GameService, private teamService: TeamService, @Inject(DOCUMENT) document, public dialog: MatDialog) { }

  ngOnInit() {
    this.getGames();
    this.getTeams();
  }

  getGames(): void  {
  	this.gameService.getGames()
      .subscribe(games => this.games = games);
  }

  getTeams(){
    this.teams = this.teamService.getTeams();
  }

  getBorderColor(id:number) {
    var team = this.getTeam(id);
    var shadowColor = team.secondaryColor.substring(0, team.secondaryColor.lastIndexOf("1")) + ".7)"
    return {
      'border-color' : team.primaryColor,
      'box-shadow': '0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px ' + shadowColor
    }
  }

  selectTeam(teamId:number, gameId:number) {
    var team = this.getTeam(teamId);
    var game = this.getGame(gameId);
    var otherTeamId = game.homeTeam == teamId ? game.awayTeam : game.homeTeam;
    var teamElement = document.getElementById(teamId + "-team-card");
    var otherTeamElement = document.getElementById(otherTeamId + "-team-card");
    document.getElementById("submit-container").style.left = "75%";
    this.submitOpened = true;
    if(teamElement.classList.contains("selectedTeam")){
      this.unSelectTeam(teamId);
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

  showSubmit() {
    if(!this.submitOpened){
      document.getElementById("submit-container").style.left = "75%";
      this.submitOpened = true;
    }else{
      document.getElementById("submit-container").style.left = "95%";
      this.submitOpened = false;
    }
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(SubmitPicksDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'submit-picks-dialog',
  templateUrl: '../dialog-content/submit-picks-dialog.html',
})
export class SubmitPicksDialog {}

