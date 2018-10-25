import { Component, OnInit } from '@angular/core';
import { PickService } from '../data-models/pick/pick.service';
import { GameService } from '../data-models/game/game.service';
import { TeamService } from '../data-models/team/team.service';
import { Game } from '../data-models/game/game';
import { Team } from '../data-models/team/team';
import { Pick } from '../data-models/pick/pick';
import { element } from 'protractor';

@Component({
  selector: 'app-my-picks-dashboard',
  templateUrl: './my-picks-dashboard.component.html',
  styleUrls: ['./my-picks-dashboard.component.css']
})
export class MyPicksDashboardComponent implements OnInit {
  myGames: Game[];
  myTeams: Team[];
  picks: Pick[];
  edit = false;
  selectablePicks = false;
  constructor(private pickService: PickService, private gameService: GameService, private teamService: TeamService) { }

  ngOnInit() {
    this.getPicks();
  }

  ngAfterViewInit() {
    this.highLightSelected();
  }

  getPicks() {
    this.picks = this.pickService.getPicks();
    var gameIds: number[] = [];
    var teamIds: number[] = [];
    this.picks.forEach(element => {
      gameIds.push(element.gameId);
    });
    this.myGames = this.gameService.getGameByIds(gameIds);
    this.myGames.forEach(element => {
      teamIds.push(element.homeTeam);
      teamIds.push(element.awayTeam);
    })
    this.myTeams = this.teamService.getTeamByIds(teamIds);
  }

  editPicks() {
    this.edit = this.edit ? false : true;
  }

  deletePick(game:Game) {
    this.picks.forEach(pick => {
      if(pick.gameId == game.id){
        this.pickService.deletePick(pick.id);
        this.getPicks();
      }
    }); 
  }

  changeTeam(game: Game) {
    this.picks.forEach(pick => {
      if(pick.gameId == game.id){
        var newTeam = pick.teamId == game.homeTeam ? game.awayTeam : game.homeTeam;
        var newPick = pick;
        newPick.teamId = newTeam;
        this.pickService.updatePick(newPick);
        this.getPicks();
        this.highLightSelected();
      }
    });
  }

  highLightSelected(){
    this.myTeams.forEach(team => {
      this.unSelectTeam(team.id);
    });
    this.picks.forEach(pick =>{
        this.selectablePicks = false;
        this.highlightSelectTeam(this.getTeam(pick.teamId));
    });
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

  getTeam(id: number): Team {
    var team
    this.myTeams.forEach((teamItem) => {
      if(id == teamItem.id){
        team = teamItem;
      }
    })
    return team;
  }

}
