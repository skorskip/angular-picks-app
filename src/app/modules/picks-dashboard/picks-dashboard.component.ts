import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { UserStanding } from 'src/app/data-models/user/user-standing';
import { UserService } from 'src/app/data-models/user/user.service';
import { LeagueService } from 'src/app/data-models/league/league.service';
import { League } from 'src/app/data-models/league/league';

@Component({
  selector: 'app-picks-dashboard',
  templateUrl: './picks-dashboard.component.html',
  styleUrls: ['./picks-dashboard.component.css']
})

export class PicksDashboardComponent implements OnInit {

  games = [] as Game[];
  stagedPicks = [] as Pick[];
  week = new Week;
  weeksView = false;
  subscription: Subscription;
  user = new User();
  teams = [] as Team[];
  loader = false;
  userData = new UserStanding();
  settings = new League();
  picked = [] as Pick[];


  constructor(
    public dialog: MatDialog, 
    private weekService: WeekService, 
    private pickService: PickService, 
    public snackBar: MatSnackBar, 
    private router:Router,
    private weeksService:WeeksService,
    private authService:AuthenticationService,
    private teamService:TeamService,
    private route:ActivatedRoute,
    private userService: UserService,
    private leagueService: LeagueService) { 
      this.subscription = this.weeksService.weekSelected$.subscribe(weekSeason => {
        this.loader = true;
        this.initWeek(weekSeason)
      });

      this.leagueService.getLeagueSettings().subscribe(settings => this.settings = settings);
    }

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    var season = +this.route.snapshot.paramMap.get('season') as number;
    var week = +this.route.snapshot.paramMap.get('week') as number;
    this.loader = true;

    if(season == 0 || week == 0) {
      this.weekService.getCurrentWeek().subscribe(currentWeek => {
        season = currentWeek.season;
        week = currentWeek.week;

        this.weekService.getWeek(season, week).subscribe(week => {
          this.initWeek(week)
        });

      });
    } else {
      this.weekService.getWeek(season, week).subscribe(week => {
        this.initWeek(week)
      });
    }
  }

  initWeek(week: Week) {
    this.games = [];
    this.teams = [];
    this.week = week;
    this.teams = week.teams;

    this.removePickedGames(week.games).then((games: Game[])=>{
      this.games = games;
      this.loader = false;
    });

    this.userService.getStandingsByUser(week.season, this.user).subscribe((result:UserStanding[]) => {
      this.userData = result[0];
    });

    this.stagedPicks = this.pickService.getStagedPicks().picks;

  }

  teamLoaded(event) {
    this.showSubmit();
    this.highlightGameResult(event);
    this.highlightStagedPick(event);
  }

  removePickedGames(games: Game[]) {
    return new Promise((resolve, reject)=>{
      this.pickService.getPicksByWeek(this.user, this.week.season, this.week.number).subscribe((picks) => {
        this.picked = picks.picks;
        this.picked.forEach(pick => {
          games.forEach((game, i) => {
            if(pick.game_id == game.game_id) {
              games.splice(i, 1);
            }
          })
        });
        resolve(games);
      });
    });
  }

  teamClicked(opened: boolean){
    this.showSubmit();
  }

  showSubmit() {
    let submitOpened = this.stagedPicks.length > 0;
    if(submitOpened){
      if(document.getElementById("submit-container") != null) {
        document.getElementById("submit-container").style.bottom = "10px";
      }
    }else{
      if(document.getElementById("submit-container") != null) {
        document.getElementById("submit-container").style.bottom = "-65px";
      }
    }
  }

  stageSelectedPick(selectedPick: Pick){
    var pickAdded = false;
    selectedPick.user_id = this.user.user_id;
    
    for(var i = 0; i < this.stagedPicks.length; i++) {
      var stagedPick = this.stagedPicks[i];

      if(stagedPick.game_id == selectedPick.game_id) {
        pickAdded = true;
        if(stagedPick.team_id == selectedPick.team_id) {
          this.stagedPicks.splice(i, 1);
        } else {
          this.stagedPicks.splice(i, 1, selectedPick);
        }
      }
    }

    if(!pickAdded){
      this.stagedPicks.push(selectedPick);
    }
    
    this.pickService.setStagedPicks(this.stagedPicks);
  }
  
  openDialog() {
    if(this.stagedPicks.length == 0){
      this.dialog.open(NoPicksDialog,{width: '500px'});

    } else if((this.stagedPicks.length + this.userData.picks + this.picked.length) > this.settings.maxTotalPicks) {
      let limit = (this.stagedPicks.length + this.userData.picks + this.picked.length) - this.settings.maxTotalPicks;
      let needed = this.settings.maxTotalPicks - (this.userData.picks + this.picked.length);

      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '500px';
      dialogConfig.data = {
        limit: limit,
        needed: needed
      }
      this.dialog.open(PicksOverLimitDialog,dialogConfig);

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
              this.dialog.open(PicksErrorDialog,{width: '500px'});
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
      if((pick.game_id == game.game_id) && (new Date(game.pick_submit_by_date) > new Date())){
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

  getTitle(): string {
    let title = "";
    if(this.stagedPicks.length > 0){
      title += "(" + this.stagedPicks.length + " picked)"
    }
    return title;
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

@Component({
  selector: 'picks-over-limit-dialog',
  templateUrl: '../../components/dialog-content/picks-over-limit-dialog.html'
})
export class PicksOverLimitDialog {
  limit: number;
  needed: number;
  constructor(
    public dialogRef: MatDialogRef<PicksOverLimitDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.limit = data.limit;
      this.needed = data.needed;
    }
}
