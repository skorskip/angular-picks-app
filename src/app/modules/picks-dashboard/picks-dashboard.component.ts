import { Component, OnInit, Inject, ComponentFactoryResolver } from '@angular/core';
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
import { CurrentWeek } from 'src/app/data-models/week/current-week';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { UserPickLimit } from 'src/app/data-models/user/user-pick-limit';

@Component({
  selector: 'app-picks-dashboard',
  templateUrl: './picks-dashboard.component.html',
  styleUrls: ['./picks-dashboard.component.css']
})

export class PicksDashboardComponent implements OnInit {

  games = [] as Game[];
  stagedPicks = [] as Pick[];
  week = new Week();
  weeksView = false;
  subscription: Subscription;
  user = new User();
  teams = [] as Team[];
  loader = false;
  userData = new UserStanding();
  maxTotalPicks = 0;
  currentWeek = new CurrentWeek();
  weekUserPicks = [] as any[];

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
    private dateFormatter: DateFormatterService) { 
      this.subscription = this.weeksService.weekSelected$.subscribe(weekSeason => {
        this.loader = true;
        this.initWeek(weekSeason.season,weekSeason.seasonType, weekSeason.week)
      });
    }

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    var season = +this.route.snapshot.paramMap.get('season') as number;
    var seasonType = +this.route.snapshot.paramMap.get('seasonType') as number;
    var week = +this.route.snapshot.paramMap.get('week') as number;
    
    this.loader = true;

    this.weekService.getCurrentWeek().subscribe(currentWeek => {
      this.currentWeek = currentWeek;

      this.userService.getUserPickLimit(this.currentWeek.season, 
        this.currentWeek.seasonType, 
        this.authService.currentUserValue.user_id).subscribe((limit: UserPickLimit) => {
          this.maxTotalPicks = limit.max_picks;
        });

      if(season == 0 || week == 0 || seasonType == 0) {
        season = this.currentWeek.season;
        seasonType = this.currentWeek.seasonType;
        week = this.currentWeek.week;
      }

      this.initWeek(season, seasonType, week);
    });
  }

  initWeek(season: number, seasonType: number, week: number) {
    this.games = [];
    this.teams = [];

    this.pickService.getWeekPicksByGame(season, seasonType, week).subscribe((result:any) => {
      this.weekUserPicks = result;

      this.weekService.getWeek(season, seasonType, week, this.user).subscribe(week => {
        if(week != null) {
          this.week = week;
          this.teams = week.teams;
          this.games = week.games;
      
          this.userService.getStandingsByUser(week.season, week.seasonType, week.number, this.user).subscribe((result:UserStanding[]) => {
            if(result != null) {
              this.userData = result[0];
            }
          });
      
          this.stagedPicks = this.pickService.getStagedPicks();
          this.loader = false;
        } else {
          this.loader = false;
        }
      });
    });
  }

  teamLoaded(event) {
    this.showSubmit();
    this.highlightGameResult(event);
    if(this.week.number == this.currentWeek.week) {
      this.highlightStagedPick(event);
    }
  }

  teamClicked(opened: boolean){
    this.showSubmit();
  }

  showSubmit() {
    let submitOpened = (this.stagedPicks.length > 0) && (this.week.number == this.currentWeek.week);
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
    selectedPick.user_id = this.user.user_id
    this.stagedPicks = this.pickService.addStagedPick(selectedPick);
  }
  
  openDialog() {

    var unsubmitableGame = false;

    for(var i = 0; i < this.games.length; i++) {
      let pickable = this.pickService.removeStagedPickPastSumbit(this.games[i]);
      this.stagedPicks = this.pickService.getStagedPicks();
      if(pickable === -1) {
        unsubmitableGame = true;
      }
    }

    var userTotalPicks = this.stagedPicks.length + this.userData.picks + this.userData.pending_picks;

    if(this.stagedPicks.length == 0 && unsubmitableGame != true){
      this.dialog.open(NoPicksDialog,{width: '500px'});
    } else if(userTotalPicks > this.maxTotalPicks) {
      let limit = userTotalPicks - this.maxTotalPicks;
      let needed = this.maxTotalPicks - (this.userData.picks + this.userData.pending_picks);
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '500px';
      dialogConfig.data = {
        limit: limit,
        needed: needed
      }
      this.dialog.open(PicksOverLimitDialog,dialogConfig);
    } else if (unsubmitableGame) { 
      this.dialog.open(PicksErrorDialog,{width: '500px'});
    } else {
      this.pickService.addPicks(this.stagedPicks).subscribe(status => {
        if(status) {
          this.pickService.clearStagedPicks();
          this.snackBar.open("picks submitted",'', {duration:3000, panelClass:"success-background"});
          this.router.navigate(['/picks/' + this.week.season + '/' + this.week.seasonType + '/' + this.week.number]);
        } else {
          this.dialog.open(PicksErrorDialog,{width: '500px'});
        }
      });
    }
  }

  highlightGameResult(game: Game){
    if(game.game_status == 'COMPLETED'){
      if(game.winning_team_id != null){
        var win_team = this.teamService.getTeamLocal(game.winning_team_id, this.teams);
        document.getElementById(game.winning_team_id + "-team-info").classList.remove(win_team.display_color);
        document.getElementById(game.winning_team_id + "-team-card").classList.remove("quaternary-background");
        document.getElementById(game.winning_team_id + "-team-info").classList.add("base");
        document.getElementById(game.winning_team_id + "-team-card").classList.add(win_team.display_color + "-background");
      }
    }
  }

  highlightStagedPick(game: Game){
    var pick = this.pickService.removeStagedPickPastSumbit(game);
    this.stagedPicks = this.pickService.getStagedPicks();
    if(pick != null) {
      this.teamService.highlightSelectTeam(this.teamService.getTeamLocal(pick, this.teams));
    }
  }

  showSubmitTime(index: number): boolean {
    if((index == 0) || this.games[index - 1].pick_submit_by_date != this.games[index].pick_submit_by_date){
      return new Date(this.games[index].pick_submit_by_date) > new Date()
    } else return false;
  }

  submitDate(game: Game):string {
    return this.dateFormatter.formatDate(new Date(game.pick_submit_by_date));
  }

  getTitle(): string {
    let title = "";
    if(this.stagedPicks.length > 0 && (this.week.number == this.currentWeek.week)){
      title += this.stagedPicks.length + " Selected"
    }
    return title;
  }

  userCanSelect(): boolean {
    return this.user.type !== 'participant';
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
