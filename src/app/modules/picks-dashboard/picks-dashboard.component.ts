import { Component, OnInit, Inject, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Game } from '../../data-models/game/game';
import { Week } from '../../data-models/week/week';
import { WeekService } from '../../data-models/week/week.service';
import { Pick } from '../../data-models/pick/pick';
import { PickService } from '../../data-models/pick/pick.service';
import { User } from 'src/app/data-models/user/user';
import { Team } from 'src/app/data-models/team/team';
import { TeamService } from 'src/app/data-models/team/team.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserStanding } from 'src/app/data-models/user/user-standing';
import { UserService } from 'src/app/data-models/user/user.service';
import { LeagueService } from 'src/app/data-models/league/league.service';
import { CurrentWeek } from 'src/app/data-models/week/current-week';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { PickData } from 'src/app/data-models/pick/pick-data';

@Component({
  selector: 'app-picks-dashboard',
  templateUrl: './picks-dashboard.component.html',
  styleUrls: ['./picks-dashboard.component.css']
})

export class PicksDashboardComponent implements OnInit {

  games = [] as Game[];
  stagedPicks = [] as Pick[];
  weekObject = new Week();
  weeksView = false;
  user = new User();
  teams = [] as Team[];
  loader = false;
  userData = new UserStanding();
  maxTotalPicks = 0;
  weekUserPicks = [] as any[];
  
  @Input() currentWeek = new CurrentWeek();
  @Input() week = 0;
  @Input() seasonType = 0;
  @Input() season = 0;

  @Input() subSubmitPicks = false;
  @Input() subPicksUpdated = false;

  @Output() title = new EventEmitter();
  @Output() displaySubmitButton = new EventEmitter();
  @Output() picksSubmitted = new EventEmitter();
  @Output() peekUser = new EventEmitter();

  constructor(
    public dialog: MatDialog, 
    private weekService: WeekService, 
    private pickService: PickService, 
    public snackBar: MatSnackBar,
    private authService:AuthenticationService,
    private teamService:TeamService,
    private userService: UserService,
    private dateFormatter: DateFormatterService,
    private leagueService: LeagueService) { 
      this.leagueService.getLeagueSettings().subscribe(settings => {
        this.maxTotalPicks = settings.maxTotalPicks;
      });
    }

  ngOnInit() {
    this.user = this.authService.currentUserValue;
  }

  ngOnChanges(changes: SimpleChange) {
    if(changes["week"]?.currentValue != changes["week"]?.previousValue && changes["week"]?.currentValue != 0) {
      this.loader = true;
      this.initWeek(this.season, this.seasonType, this.week);
    }

    if((changes["subSubmitPicks"]?.currentValue != changes["subSubmitPicks"]?.previousValue) && changes["subSubmitPicks"]?.currentValue){
      this.openDialog();
    }

    if(changes["subPicksUpdated"]?.currentValue) {
      this.initWeek(this.season, this.seasonType, this.week);
    }
  }

  initWeek(season: number, seasonType: number, week: number) {
    this.games = [];
    this.teams = [];

    this.userService.getStandingsByUser(this.weekObject.season, this.weekObject.seasonType, this.weekObject.number, this.user).subscribe((result:UserStanding[]) => {
      if(result != null) {
        this.userData = result[0];
      }
    });

    this.pickService.getWeekPicksByGame(season, seasonType, week).subscribe((result:any) => {
      this.weekUserPicks = result;

      this.weekService.getWeek(season, seasonType, week, this.user).subscribe(week => {
        if(week != null) {
          this.weekObject = week;
          this.teams = week.teams;
          this.games = week.games;
          this.stagedPicks = this.pickService.getStagedPicks();
          this.getTitle();
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
    if(this.weekObject.number == this.currentWeek.week) {
      this.highlightStagedPick(event);
    }
  }

  teamClicked(opened: boolean){
    this.showSubmit();
  }

  showSubmit() {
    let submitOpened = (this.stagedPicks.length > 0) && (this.weekObject.number == this.currentWeek.week);
    this.displaySubmitButton.emit(submitOpened);
  }

  stageSelectedPick(selectedPick: Pick){
    selectedPick.user_id = this.user.user_id
    this.stagedPicks = this.pickService.addStagedPick(selectedPick);
    this.getTitle();
  }
  
  openDialog() {
    var unsubmitableGame = false;

    for(var i = 0; i < this.games.length; i++) {
      let pickable = this.pickService.removeStagedPickPastSumbit(this.games[i]);
      this.stagedPicks = this.pickService.getStagedPicks();
      this.getTitle();
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
      this.picksSubmitted.emit(true);
      this.dialog.open(PicksOverLimitDialog,dialogConfig);
    } else if (unsubmitableGame) { 
      this.picksSubmitted.emit(true);
      this.dialog.open(PicksErrorDialog,{width: '500px'});
    } else {
      this.pickService.addPicks(this.stagedPicks).subscribe(status => {
        if(status) {
          this.picksSubmitted.emit(true);
          this.pickService.clearStagedPicks();
          this.stagedPicks = this.pickService.getStagedPicks();
          this.getTitle();
          this.snackBar.open("picks submitted",'', {duration:3000, panelClass:["success-snack", "quaternary-background", "secondary"]});
          this.initWeek(this.weekObject.season, this.weekObject.seasonType, this.weekObject.number);
        } else {
          this.picksSubmitted.emit(true);
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

  getTitle() {
    let title = "";
    if(this.stagedPicks.length > 0 && (this.weekObject.number == this.currentWeek.week)){
      title += this.stagedPicks.length + " Selected"
    }
    this.title.emit(title);
  }

  userCanSelect(): boolean {
    return this.user.type !== 'participant';
  }

  peekUserSelected(event){
    this.peekUser.emit(event);
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
