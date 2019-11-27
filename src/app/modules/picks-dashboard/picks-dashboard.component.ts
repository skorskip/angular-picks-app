import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Game } from '../../data-models/game/game';
import { Week } from '../../data-models/week/week';
import { WeekService } from '../../data-models/week/week.service';
import { Pick } from '../../data-models/pick/pick';
import { PickService } from '../../data-models/pick/pick.service';
import { WeeksService } from '../../components/weeks/weeks.service';
import { Subscription }   from 'rxjs';
import { User } from 'src/app/data-models/user/user';
import { Team } from 'src/app/data-models/team/team';
import { TeamService } from 'src/app/data-models/team/team.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-picks-dashboard',
  templateUrl: './picks-dashboard.component.html',
  styleUrls: ['./picks-dashboard.component.css']
})

export class PicksDashboardComponent implements OnInit {

  games = [] as Game[];
  stagedPicks = [] as Pick[];
  week = new Week;
  submitOpened = false;
  weeksView = false;
  subscription: Subscription;
  user = new User();
  teams = [] as Team[];

  constructor(
    public dialog: MatDialog, 
    private weekService: WeekService, 
    private pickService: PickService, 
    public snackBar: MatSnackBar, 
    private router:Router,
    private weeksService:WeeksService,
    private authService:AuthenticationService,
    private teamService:TeamService,
    private route:ActivatedRoute) { 
      this.subscription = this.weeksService.weekSelected$.subscribe(weekSeason => this.initWeek(weekSeason));
    }

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    var season = +this.route.snapshot.paramMap.get('season') as number;
    var week = +this.route.snapshot.paramMap.get('week') as number;
    if(season == 0 || week == 0) {
      this.weekService.getCurrentWeek().subscribe(currentWeek => this.initWeek(currentWeek));
    } else {
      this.weekService.getWeek(season, week).subscribe(week => this.initWeek(week));
    }
  }

  initWeek(week: Week) {
    this.games = [];
    this.teams = [];
    this.week = week;
    this.games = week.games;
    this.initTeams(week.teams);
    this.removePickedGames();
    this.stagedPicks = this.pickService.getStagedPicks().picks;
  }

  teamLoaded(event) {
    this.highlightGameResult(event);
    this.highlightStagedPick(event);
  }

  initTeams(teamIds: number[]) {
    this.teamService.getTeamByIds(teamIds).subscribe(
      teams => this.teams = teams
    );
  }

  removePickedGames() {
    this.pickService.getPicksByWeek(this.user.user_id, this.week.season, this.week.number).subscribe(
      picks => {
        picks.forEach(pick => {
          this.games.forEach((game, i) => {
            if(pick.game_id == game.game_id) {
              this.games.splice(i, 1);
            }
          })
        });
      }
    );
  }

  teamClicked(opened: boolean){
    this.submitOpened = false;
    this.showSubmit();
  }

  showSubmit() {
    this.submitOpened = !this.submitOpened;
    if(this.submitOpened){
      document.getElementById("submit-container").style.right = "0px";
    }else{
      document.getElementById("submit-container").style.right = "-160px";
    }
  }

  stageSelectedPick(selectedPick: Pick){
    var pickAdded = false;
    
    for(var i = 0; i < this.stagedPicks.length; i++) {
      var stagedPick = this.stagedPicks[i];

      if(stagedPick.game_id == selectedPick.game_id) {
        if(stagedPick.team_id == selectedPick.team_id) {
          this.stagedPicks.splice(i, 1);
        } else this.stagedPicks.splice(i, 1, selectedPick);
        pickAdded = true;
      }
    }

    if(!pickAdded){
      selectedPick.user_id = this.user.user_id;
      this.stagedPicks.push(selectedPick);
    }

    this.pickService.setStagedPicks(this.stagedPicks);
  }
  
  openDialog() {
    if(this.stagedPicks.length == 0){
      const dialogRef = this.dialog.open(NoPicksDialog,{width: '500px'});
    } else {
      const dialogRef = this.dialog.open(SubmitPicksDialog,{width: '500px'});
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.pickService.addPicks(this.stagedPicks).subscribe(status => {
            if(status) {
              this.pickService.clearStagedPicks();
              this.snackBar.open("picks submitted",'', {duration:3000});
              this.router.navigate(['/picks/' + this.week.season + '/' + this.week.number]);
            } else {
              const dialogRef = this.dialog.open(PicksErrorDialog,{width: '500px'});
            }
          });
        }
      });
    }
  }

  highlightGameResult(game: Game){
    if(game.game_status == 'COMPLETED'){
      if(game.winning_team != null){
        document.getElementById(game.winning_team + "-team-card").classList.remove("base-background");
        document.getElementById(game.winning_team + "-team-card").classList.add("highlight-border");
      }
    }
  }

  highlightStagedPick(game: Game){
    this.stagedPicks.forEach(pick =>{
      if(pick.game_id == game.game_id){
        this.teamService.highlightSelectTeam(this.getTeam(pick.team_id));
      }
    });
  }

  showSubmitTime(index: number): boolean {
    if((index == 0) || this.games[index - 1].pick_submit_by_date != this.games[index].pick_submit_by_date){
      return true;
    } else return false;
  }

  getTeam(id: number): Team {
    var team
    this.teams.forEach((teamItem) => {
      if(id == teamItem.team_id){
        team = teamItem;
      }
    })
    return team;
  }

  getGame(id: number): Game {
    var game
    this.games.forEach((gameItem) => {
      if(id == gameItem.game_id){
        game = gameItem;
      }
    })
    return game;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

@Component({
  selector: 'no-picks-dialog',
  templateUrl: '../../components/dialog-content/no-picks-dialog.html',
})
export class NoPicksDialog {}

@Component({
  selector: 'submit-picks-dialog',
  templateUrl: '../../components/dialog-content/submit-picks-dialog.html',
})
export class SubmitPicksDialog {}

@Component({
  selector: 'picks-error-dialog',
  templateUrl: '../../components/dialog-content/picks-error-dialog.html'
})
export class PicksErrorDialog {}
