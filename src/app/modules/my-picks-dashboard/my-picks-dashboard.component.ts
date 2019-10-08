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
          this.router.navigate(['/myPicks/' + week.season + '/' + week.number]);
          this.initWeek(week.season, week.number)
        }
      )
    }

  ngOnInit() {
    const season = +this.route.snapshot.paramMap.get('season') as number;
    const week = +this.route.snapshot.paramMap.get('week') as number;
    this.initWeek(season, week);
  }

  initWeek(season, week) {
    this.week.number = week;
    this.week.season = season;
    this.getPicksByWeek(season, week);

  }

  teamLoaded(event) {
    this.highlightSelected(event);
  }

  getPicksByWeek(season: number, week: number) {
    this.pickService.getPicksByWeek(3, season, week).subscribe( picks => {
      this.picks = picks;
      if(this.picks.length != 0){
    
        var gameIds: number[] = [];
        var teamIds: number[] = [];
        
        this.picks.forEach(pick => {
          gameIds.push(pick.gameId);
        });
        
        this.gameService.getGameByIds(gameIds).subscribe(games => {
          this.myGames = games;
          this.myGames.forEach(game => {
            teamIds.push(game.homeTeam);
            teamIds.push(game.awayTeam);
          })
          this.teamService.getTeamByIds(teamIds).subscribe(
            teams => this.myTeams = teams
          );
        });
      }
    });
  }

  editPicks() {
    this.edit = this.edit ? false : true;
  }

  deletePick(game:Game) {
    this.picks.forEach(pick => {
      if(pick.gameId == game.gameId){
        this.pickService.deletePick(pick.pickId);
        this.ngOnInit();
      }
    }); 
  }

  changeTeam(game: Game) {
    this.picks.forEach(pick => {
      if(pick.gameId == game.gameId){
        var newTeam = pick.teamId == game.homeTeam ? game.awayTeam : game.homeTeam;
        var newPick = pick;
        newPick.teamId = newTeam;
        this.pickService.updatePick(newPick);
        this.initWeek(this.week.season, this.week.number);
      }
    });
  }

  highlightSelected(game){
    this.picks.forEach(pick =>{
      if(pick.gameId == game.gameId){
        this.unSelectTeam(game.awayTeam);
        this.unSelectTeam(game.homeTeam)
        this.highlightSelectTeam(this.getTeam(pick.teamId));
      }
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
    var teamElement = document.getElementById(team.teamId + "-team-card");
    teamElement.classList.remove("body-color-secondary");
    teamElement.style.backgroundColor = team.primaryColor;
    teamElement.style.color = "white";
    teamElement.classList.add("selectedTeam");
  }

  pickResult(game: Game):boolean {
    if(game.status == 'COMPLETED'){
      for(var i = 0; i < this.picks.length; i ++) {
        var pick = this.picks[i];
        if(pick.gameId == game.gameId) {
          var pickedTeamScore = pick.teamId === game.homeTeam ? (game.homeScore + game.spread): game.awayScore;
          var otherTeamScore = pick.teamId === game.homeTeam ? game.awayScore : (game.homeScore + game.spread);
          return pickedTeamScore > otherTeamScore;
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
      if(id == teamItem.teamId){
        team = teamItem;
      }
    })
    return team;
  }

  getGame(id: number): Game {
    var game
    this.myGames.forEach((gameItem) => {
      if(id == gameItem.gameId){
        game = gameItem;
      }
    })
    return game;
  }

  showSubmitTime(index: number): boolean {
    if((index == 0) || this.myGames[index - 1].submitDate != this.myGames[index].submitDate){
      return true;
    }
    else return false;
  }

  showEdit(game: Game): boolean {
    if(this.edit && game.status == "UNPLAYED") {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
