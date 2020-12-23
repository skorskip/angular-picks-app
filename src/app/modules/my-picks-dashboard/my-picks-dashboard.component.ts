import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { PickService } from '../../data-models/pick/pick.service';
import { TeamService } from '../../data-models/team/team.service';
import { Week } from '../../data-models/week/week';
import { Game } from '../../data-models/game/game';
import { Team } from '../../data-models/team/team';
import { Pick } from '../../data-models/pick/pick';
import { WeeksService } from '../../components/weeks/weeks.service';
import { Subscription }   from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/data-models/user/user';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { WeekService } from 'src/app/data-models/week/week.service';
import { WeekPicks } from 'src/app/data-models/pick/week-picks';
import { MatDialog } from '@angular/material/dialog';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  stagedEdits = [] as Pick[];
  stagedDeletes = [] as Pick[];
  showEditButton = true;
  toggleType = "picks"
  loader = false;
  weekUserPicks = [] as any[];
  snapshot = new WeekPicks;
  @Input() otherUser = null;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar, 
    private pickService: PickService,
    private teamService: TeamService, 
    private weeksService: WeeksService,
    private weekService: WeekService,
    private route:ActivatedRoute,
    private dateFormatter: DateFormatterService,
    private authService:AuthenticationService) { 
      this.subscription = this.weeksService.weekSelected$.subscribe(
        week => {
          this.initWeek(week.season, week.seasonType, week.week, false)
        }
      )
    }

  ngOnInit() {
  
    if(this.otherUser == null) {
      this.user= this.authService.currentUserValue;
    } else {
      this.toggleType = "none";
    }

    var season = +this.route.snapshot.paramMap.get('season') as number;
    var seasonType = +this.route.snapshot.paramMap.get('seasonType') as number;
    var week = +this.route.snapshot.paramMap.get('week') as number;

    if(season == 0 || week == 0 || seasonType == 0) {
      this.weekService.getCurrentWeek().subscribe(currentWeek => {
        season = currentWeek.season;
        seasonType = currentWeek.seasonType;
        week = currentWeek.week;
        this.initWeek(season, seasonType, week, false);
      });
    } else {
      this.initWeek(season, seasonType, week, false);
    }
  }

  initWeek(season: number, seasonType: number, week: number, reset: boolean) {
    this.loader = true;
    this.myTeams = [] as Team[];
    this.myGames = [] as Game[];
    this.stagedEdits = [] as Pick[];
    this.stagedDeletes = [] as Pick[];
    this.picks = [] as Pick[];
    this.week.number = week;
    this.week.season = season;
    this.week.seasonType = seasonType;
    
    this.pickService.getWeekPicksByGame(season, seasonType, week).subscribe(result => {
      this.weekUserPicks = result;
      this.getPicksByWeek(season, seasonType, week, reset);
    });
  }

  teamLoaded(event) {
    this.highlightSelected(event);
    this.highlightGameResult(event);
  }

  getPicksByWeek(season: number, seasonType: number, week: number, reset: boolean) {
    if(this.otherUser != null) {
      if(reset) {
        this.populateGamesTeams(this.snapshot);
      } else {
        this.pickService.getUsersPicksByWeek(this.otherUser, season, seasonType, week).subscribe( picks => {  
          if(picks != null){
            this.populateGamesTeams(picks);
          } else {
            this.loader = false;
          }
        });
      }
    } else {
      if(reset) {
        this.populateGamesTeams(this.snapshot);
      } else {
        this.pickService.getPicksByWeek(this.user, season, seasonType, week).subscribe( picks => {  
          if(picks != null){
            this.populateGamesTeams(picks);
          } else {
            this.loader = false;
          }
        });
      }
    }
  }

  populateGamesTeams(picks: WeekPicks){
    this.myGames = JSON.parse(JSON.stringify(picks.games));
    this.myTeams = JSON.parse(JSON.stringify(picks.teams));
    this.picks = JSON.parse(JSON.stringify(picks.picks));
    this.loader = false;

    this.myGames.forEach((game) => {
      if(new Date(game.pick_submit_by_date) > new Date()) {
        this.showEditButton = true;
      } else {
        this.showEditButton = false;
      }
    });
  }

  editPicks() {
    this.edit = !this.edit;
    if(this.edit) {
      this.snapshot.picks = JSON.parse(JSON.stringify(this.picks));
      this.snapshot.games = JSON.parse(JSON.stringify(this.myGames));
      this.snapshot.teams = JSON.parse(JSON.stringify(this.myTeams));
    }
  }

  deletePick(game:Game) {

    var deleteButton = document.getElementById("delete-" + game.game_id)
    deleteButton.remove();

    var gameElement = document.getElementById("game-" + game.game_id);
    gameElement.classList.add("disable");

    var gameContainerElement = document.getElementById("game-container-" + game.game_id);
    gameContainerElement.classList.add("disable");

    this.picks.forEach(pick => {
      if(pick.game_id == game.game_id){
        this.stagedDeletes.push(pick);
      }
    }); 
  }

  changeTeam(game: Game) {
    if(this.edit && this.showEdit(game)) {
      var editAdded = false;
      this.stagedEdits.forEach(pick => {
        if(pick.game_id == game.game_id){
          this.teamService.unSelectTeam(this.teamService.getTeamLocal(pick.team_id, this.myTeams));
          var newTeam = pick.team_id == game.home_team_id ? game.away_team_id : game.home_team_id;
          pick.team_id = newTeam;
          this.teamService.highlightSelectTeam(this.teamService.getTeamLocal(pick.team_id, this.myTeams));
          editAdded = true;
        }
      });
      if(!editAdded) {
        this.picks.forEach(pick => {
          if(pick.game_id == game.game_id){
            this.teamService.unSelectTeam(this.teamService.getTeamLocal(pick.team_id, this.myTeams));
            var newTeam = pick.team_id == game.home_team_id ? game.away_team_id : game.home_team_id;
            var newPick = JSON.parse(JSON.stringify(pick));
            newPick.team_id = newTeam;
            this.teamService.highlightSelectTeam(this.teamService.getTeamLocal(newPick.team_id, this.myTeams));
            this.stagedEdits.push(newPick);
            
          }
        });
      }
    }
  }

  submitEdits() {
    var editPastSubmit = false;

    for(var i = 0; i < this.myGames.length; i++) {
      let editable = this.pickService.checkEditPicksPastSubmit(this.myGames[i], this.stagedEdits, this.stagedDeletes)
      if(editable) {
        editPastSubmit = true;
      }
    }

    if(this.stagedDeletes.length == 0 && this.stagedEdits.length == 0){
      this.editPicks();
    } else if(editPastSubmit) { 
      const dialogError = this.dialog.open(PicksEditErrorDialog,{width: '500px'});
      dialogError.afterClosed().subscribe(result => {
        if(result) {
          this.editPicks();
          this.initWeek(this.week.season, this.week.seasonType, this.week.number, true);
        }
      })
    } else {
      this.editPicksService();
    }
  }

  editPicksService(){
    var updatePicks = this.updatePicks();
    var deletePicks = this.deletePicks();

    Promise.all([updatePicks, deletePicks]).then((results)=>{
      this.snackBar.open("edits submitted",'', {duration:3000, panelClass:"success-background"});
      this.editPicks();
      this.initWeek(this.week.season, this.week.seasonType, this.week.number, false);
    });
  }

  updatePicks(): Promise<any> {
    let promises_array:Array<any> = [];
    for(let i = 0; i < this.stagedEdits.length; i++) {
      promises_array.push(new Promise((resolve, reject)=>{
        this.pickService.updatePick(this.stagedEdits[i]).subscribe((success) => {
          if(!success){reject();}
          resolve();
        });
      }));
    }
    return Promise.all(promises_array);
  }

  deletePicks(): Promise<any>  {
    let promises_array:Array<any> = [];
    for(let i = 0; i < this.stagedDeletes.length; i++) {
      promises_array.push(new Promise((resolve, reject) => {
        this.pickService.deletePick(this.stagedDeletes[i].pick_id).subscribe((success) => {
          if(!success){reject();}
          resolve();
        });
      }));
    }
    return Promise.all(promises_array);
  }

  highlightSelected(game: Game){
    this.picks.forEach(pick =>{
      if(pick.game_id === game.game_id){
        this.teamService.highlightSelectTeam(this.teamService.getTeamLocal(pick.team_id, this.myTeams));
      }
    });
  }

  highlightGameResult(game: Game){
    if(game.game_status == 'COMPLETED'){
      if(game.winning_team_id != null){
        var win_team = this.teamService.getTeamLocal(game.winning_team_id, this.myTeams);
        var info = document.getElementById(game.winning_team_id + "-team-info");
        var team = document.getElementById(game.winning_team_id + "-team-card");
        info.classList.remove(win_team.display_color);
        info.classList.add("base");
        info.classList.add("team-info-result");
        team.classList.remove("quaternary-background");
        team.classList.add(win_team.display_color + "-background");
      }
    }
  }

  pickResult(game: Game):string {
    if(game.game_status == 'COMPLETED'){
      for(var i = 0; i < this.picks.length; i ++) {
        var pick = this.picks[i];
        if(pick.game_id == game.game_id) {
          if(pick.team_id == game.winning_team_id) {
            return "WIN";
          } else if(game.winning_team_id == null) {
            return "PUSH";
          } else {
            return "LOSE";
          }
        }
      }
      return null;
    }
    else {
      return null;
    }
  }

  showSubmitTime(index: number): boolean {
    if((index == 0) || this.myGames[index - 1].pick_submit_by_date != this.myGames[index].pick_submit_by_date){
      return new Date(this.myGames[index].pick_submit_by_date) > new Date()
    } else return false;
  }

  submitDate(game: Game):string {
    return this.dateFormatter.formatDate(new Date(game.pick_submit_by_date));
  }

  showEdit(game: Game): boolean {
    if(this.edit && new Date(game.pick_submit_by_date) > new Date()) {
      return true;
    } else {
      return false;
    }
  }

  getTitle(): string {
    let title = "";
    if(this.myGames.length > 0){
      title += this.myGames.length + " Picked"
    }
    return title;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

@Component({
  selector: 'picks-edit-error-dialog',
  templateUrl: '../../components/dialog-content/picks-edit-error-dialog.html'
})
export class PicksEditErrorDialog {}

@Component({
  selector: 'edit-picks-dialog',
  templateUrl: '../../components/dialog-content/edit-picks-dialog.html'
})
export class EditPicksDialog {}
