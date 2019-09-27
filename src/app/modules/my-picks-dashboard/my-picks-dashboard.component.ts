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
  myGames = [] as Game[];
  myTeams = [] as Team[];
  picks = [] as Pick[];
  weeks = [] as Week[];
  week = new Week();
  edit = false;
  notSelectablePicks = true;
  weeksView = false;
  pickSuccess = null;
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
        week => {
          this.weekSelected(week);
          this.router.navigate(['/myPicks/' + week.season + '/' + week.number]);
        }
      )
    }

  ngOnInit() {
    const season = +this.route.snapshot.paramMap.get('season') as number;
    const week = +this.route.snapshot.paramMap.get('week') as number;
    this.week.number = week;
    this.week.season = season;
    this.getPicksByWeek(season, week);
  }

  ngAfterViewInit() {
    this.highLightSelected();
  }

  getPicksByWeek(season: number, week: number) {
    this.picks = this.pickService.getPicksByWeek(season, week);
    if(this.picks.length != 0){
    
      var gameIds: number[] = [];
      var teamIds: number[] = [];
      
      this.picks.forEach(element => {
        gameIds.push(element.gameId);
      });
      
      this.gameService.getGameByIds(gameIds).subscribe(games => {
        this.myGames = games;
        this.myGames.forEach(element => {
          teamIds.push(element.homeTeam);
          teamIds.push(element.awayTeam);
        })
        this.teamService.getTeamByIds(teamIds).subscribe(
          teams => this.myTeams = teams
        );
      });
    }
  }

  editPicks() {
    this.edit = this.edit ? false : true;
  }Z

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
        this.getPicksByWeek(this.week.season, this.week.number);
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
    if(game.progress == 'INPROGRESS') {
      document.getElementById(game.id + "-game-card").classList.remove("body-color-secondary");
      document.getElementById(game.id + "-game-card").classList.add("accent-color-tietary");
      document.getElementById(game.id + "-game-card").classList.add("disabled");
      this.pickSuccess = null;
    }
  }

  pickResult(game: Game, index: number):boolean {
    if(game.progress == 'FINAL'){
      var pick = this.picks[index];
      if(pick.gameId == game.id) {
        var pickedTeamScore = pick.teamId === game.homeTeam ? (game.homeScore + game.spread): game.awayScore;
        var otherTeamScore = pick.teamId === game.homeTeam ? game.awayScore : (game.homeScore + game.spread);
        if(pickedTeamScore > otherTeamScore){
          return true;
        }
        else{
          return false;
        }
      }
    }
    else {
      return null;
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

  weekSelected(week:Week) {
    this.getPicksByWeek(week.season, week.number);
    setTimeout(()=>{
      this.ngAfterViewInit();
    });
  }

  showSubmitTime(index: number): boolean {
    if((index == 0) || this.myGames[index - 1].submitDate != this.myGames[index].submitDate){
      return true;
    }
    else return false;
  }

  showEdit(game: Game): boolean {
    if(this.edit && game.progress == "UNPLAYED") {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
