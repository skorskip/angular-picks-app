import { Component, OnInit } from '@angular/core';
import { PickService } from '../data-models/pick/pick.service';
import { GameService } from '../data-models/game/game.service';
import { TeamService } from '../data-models/team/team.service';
import { WeekService } from '../data-models/week/week.service';
import { Week } from '../data-models/week/week';
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
  weeks: Week[];
  week: Week;
  edit = false;
  notSelectablePicks = true;
  weeksView = false;
  constructor(private pickService: PickService, private gameService: GameService, 
    private teamService: TeamService, private weekService: WeekService) { }

  ngOnInit() {
    this.getPicksByWeek(this.weekService.getCurrentWeek().id);
  }

  ngAfterViewInit() {
    this.highLightSelected();
    var delay = .5;
    this.myGames.forEach((game,i) => {
      var element = document.getElementById(game.id + "-game-card");
        element.style.animationDuration = (delay + (i * .5)) + 's';
    })  
  }

  getPicksByWeek(weekId:number) {
    this.week = this.weekService.getWeek(weekId);
    this.picks = this.pickService.getPicksByWeek(weekId);
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
        this.getPicksByWeek(this.week.id);
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
        this.getPicksByWeek(this.week.id);
        this.highLightSelected();
      }
    });
  }

  highLightSelected(){
    this.myTeams.forEach(team => {
      this.unSelectTeam(team.id);
    });
    this.picks.forEach(pick =>{
        this.highlightPickResult(pick);
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

  highlightPickResult(pick:Pick){
    var game = this.getGame(pick.gameId);
    var pickedTeamScore = pick.teamId === game.homeTeam ? (game.homeScore + game.spread): game.awayScore;
    var otherTeamScore = pick.teamId === game.homeTeam ? game.awayScore : (game.homeScore + game.spread);
    if(game.progress == 'FINAL'){
      var gameElement = document.getElementById(game.id + "-game-card");
      if(pickedTeamScore > otherTeamScore){
        gameElement.style.background = "lightgreen";
      }
      else{
        gameElement.style.background = "lightcoral";
      }
    }
    else if(game.progress == 'INPROGRESS') {
      document.getElementById(game.id + "-game-card").style.backgroundColor = "#f857a6";
    }
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

  getGame(id: number): Game {
    var game
    this.myGames.forEach((gameItem) => {
      if(id == gameItem.id){
        game = gameItem;
      }
    })
    return game;
  }

  showWeeks() {
    this.weeks = this.weekService.getWeeks();
    var element = document.getElementById("week-card");
    element.className = "week-out-animation";
    
    setTimeout(()=>{
      this.weeksView = true;
    },500);
  }

  weekSelected(weekSelected:Week) {
    this.getPicksByWeek(weekSelected.id);
    var element = document.getElementById("weeks-container");
    element.className = "week-out-animation";
    setTimeout(()=>{
      this.weeksView = false;
      setTimeout(()=>{
        this.ngAfterViewInit();
      })
    },500);
  }

}
