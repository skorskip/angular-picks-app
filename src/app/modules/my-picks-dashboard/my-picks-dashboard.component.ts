import { Component, OnInit } from '@angular/core';
import { PickService } from '../../data-models/pick/pick.service';
import { GameService } from '../../data-models/game/game.service';
import { TeamService } from '../../data-models/team/team.service';
import { Week } from '../../data-models/week/week';
import { Game } from '../../data-models/game/game';
import { Team } from '../../data-models/team/team';
import { Pick } from '../../data-models/pick/pick';
import { WeeksService } from '../../components/weeks/weeks.service';
import { Subscription }   from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { User } from 'src/app/data-models/user/user';
import { UserService } from 'src/app/data-models/user/user.service';

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
  user = new User();

  constructor(
    private pickService: PickService, 
    private gameService: GameService, 
    private teamService: TeamService, 
    private weeksService: WeeksService,
    private route:ActivatedRoute,
    private router:Router,
    private userService:UserService) { 
      this.subscription = this.weeksService.weekSelected$.subscribe(
        week => {
          this.router.navigate(['/myPicks/' + week.season + '/' + week.number]);
          this.initWeek(week.season, week.number)
        }
      )
    }

  ngOnInit() {
    this.user = this.userService.currentUser;
    const season = +this.route.snapshot.paramMap.get('season') as number;
    const week = +this.route.snapshot.paramMap.get('week') as number;
    this.initWeek(season, week);
  }

  initWeek(season, week) {
    this.myTeams = [];
    this.week.number = week;
    this.week.season = season;
    this.getPicksByWeek(season, week);
  }

  teamLoaded(event) {
    this.highlightSelected(event);
  }

  getPicksByWeek(season: number, week: number) {
    this.pickService.getPicksByWeek(this.user.user_id, season, week).subscribe( picks => {
      this.picks = picks;
      if(this.picks.length != 0){
    
        var gameIds: number[] = [];
        var teamIds: number[] = [];
        
        this.picks.forEach(pick => {
          gameIds.push(pick.game_id);
        });
        
        this.gameService.getGameByIds(gameIds).subscribe(games => {
          this.myGames = games;
          this.myGames.forEach(game => {
            teamIds.push(game.home_team);
            teamIds.push(game.away_team);
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
      if(pick.game_id == game.game_id){
        this.pickService.deletePick(pick.pick_id).subscribe(() => {
          this.initWeek(this.week.season, this.week.number);
          return;
        });   
      }
    }); 
  }

  changeTeam(game: Game) {
    this.picks.forEach(pick => {
      if(pick.game_id == game.game_id){
        var newTeam = pick.team_id == game.home_team ? game.away_team : game.home_team;
        var newPick = pick;
        newPick.team_id = newTeam;
        this.pickService.updatePick(newPick).subscribe(() => {
          this.initWeek(this.week.season, this.week.number);
          return;
        });
      }
    });
  }

  highlightSelected(game: Game){
    this.picks.forEach(pick =>{
      if(pick.game_id == game.game_id){
        this.unSelectTeam(game.away_team);
        this.unSelectTeam(game.home_team)
        this.highlightSelectTeam(this.getTeam(pick.team_id));
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
    var teamElement = document.getElementById(team.team_id + "-team-card");
    teamElement.classList.remove("body-color-secondary");
    teamElement.style.backgroundColor = team.primary_color;
    teamElement.style.color = "white";
    teamElement.classList.add("selectedTeam");
  }

  pickResult(game: Game):boolean {
    if(game.game_status == 'COMPLETED'){
      for(var i = 0; i < this.picks.length; i ++) {
        var pick = this.picks[i];
        if(pick.game_id == game.game_id) {
          return pick.team_id == game.winning_team;
        }
      }
      return null;
    }
    else {
      return null;
    }
  }

  getTeam(id: number): Team {
    var team
    this.myTeams.forEach((teamItem) => {
      if(id == teamItem.team_id){
        team = teamItem;
      }
    })
    return team;
  }

  getGame(id: number): Game {
    var game
    this.myGames.forEach((gameItem) => {
      if(id == gameItem.game_id){
        game = gameItem;
      }
    })
    return game;
  }

  showSubmitTime(index: number): boolean {
    if((index == 0) || this.myGames[index - 1].pick_submit_by_date != this.myGames[index].pick_submit_by_date){
      return true;
    }
    else return false;
  }

  showEdit(game: Game): boolean {
    if(this.edit && game.game_status == "UNPLAYED") {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
