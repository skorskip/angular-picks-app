import { Component, OnInit } from '@angular/core';
import { PickService } from '../../data-models/pick/pick.service';
import { GameService } from '../../data-models/game/game.service';
import { TeamService } from '../../data-models/team/team.service';
import { WeekService } from '../../data-models/week/week.service';
import { Week } from '../../data-models/week/week';
import { Game } from '../../data-models/game/game';
import { Team } from '../../data-models/team/team';
import { Pick } from '../../data-models/pick/pick';
import { WeeksService } from '../../components/weeks/weeks.service';
import { Subscription }   from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

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
  subscription: Subscription;

  constructor(
    private pickService: PickService, 
    private gameService: GameService, 
    private teamService: TeamService, 
    private weekService: WeekService, 
    private weeksService: WeeksService,
    private route:ActivatedRoute,
    private router:Router) { 
      this.subscription = this.weeksService.weekSelected$.subscribe(
        weekId => {
          this.weekSelected(weekId);
          this.router.navigate(['/myPicks/' + weekId]);
        }
      )
    }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('weekId');
    this.getPicksByWeek(id);
  }

  ngAfterViewInit() {
    this.highLightSelected();
    this.myGames.forEach((game,i) => {
      var element = document.getElementById(game.id + "-game-card");
        element.style.animationDuration = (.5 + (i * .5)) + 's';
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
        this.ngOnInit();
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
    team.style.backgroundColor = "";
    team.style.color = "";
    team.classList.add("body-color-secondary");
    team.classList.remove("selectedTeam");
  }

  highlightSelectTeam(team:Team){
    var teamElement = document.getElementById(team.id + "-team-card");
    teamElement.classList.remove("body-color-secondary");
    teamElement.style.backgroundColor = team.primaryColor;
    teamElement.style.color = "white";
    teamElement.classList.add("selectedTeam");
  }

  highlightPickResult(pick:Pick){
    var game = this.getGame(pick.gameId);
    var pickedTeamScore = pick.teamId === game.homeTeam ? (game.homeScore + game.spread): game.awayScore;
    var otherTeamScore = pick.teamId === game.homeTeam ? game.awayScore : (game.homeScore + game.spread);
    if(game.progress == 'FINAL'){
      var gameElement = document.getElementById(pick.teamId + "-team-card");
      if(pickedTeamScore > otherTeamScore){
        var gameElement = document.getElementById(pick.teamId + "-team-card");
        gameElement.style.borderColor = "lightgreen";
      }
      else{
        var  otherTeamId = pick.teamId 
        var gameElement = document.getElementById(pick.teamId + "-team-card");
        gameElement.classList.remove("body-color-secondary");
        gameElement.style.borderColor = "rgb(228, 46, 46)";
      }
    }
    else if(game.progress == 'INPROGRESS') {
      document.getElementById(game.id + "-game-card").classList.remove("body-color-secondary");
      document.getElementById(game.id + "-game-card").classList.add("accent-color-tietary");
      document.getElementById(game.id + "-game-card").classList.add("disabled");
  
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
    var element = document.getElementById("week-card");
    element.className = "week-out-animation";    
    setTimeout(()=>{
      this.weeksView = true;
    },500);
  }

  weekSelected(weekId:number) {
    this.getPicksByWeek(weekId);
    setTimeout(()=>{
      this.weeksView = false;
      setTimeout(()=>{
        this.ngAfterViewInit();
      })
    },500);
  }

  showSubmitTime(index: number): boolean {
    if((index == 0) || this.myGames[index - 1].submitDate != this.myGames[index].submitDate){
      return true;
    }
    else return false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
