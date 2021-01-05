import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, SimpleChange } from '@angular/core';
import { PickService } from '../../data-models/pick/pick.service';
import { TeamService } from '../../data-models/team/team.service';
import { Week } from '../../data-models/week/week';
import { Game } from '../../data-models/game/game';
import { Team } from '../../data-models/team/team';
import { Pick } from '../../data-models/pick/pick';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { WeekPicks } from 'src/app/data-models/pick/week-picks';
import { MatDialog } from '@angular/material/dialog';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { slideDownAnimation } from 'src/app/animations/app-routing-animation';

@Component({
  selector: 'app-my-picks-dashboard',
  templateUrl: './my-picks-dashboard.component.html',
  styleUrls: ['./my-picks-dashboard.component.css'],
  animations: [slideDownAnimation]
})
export class MyPicksDashboardComponent implements OnInit {
  myGames = [] as Game[];
  myTeams = [] as Team[];
  picks = [] as Pick[];
  weeks = [] as Week[];
  weekObject = new Week();
  edit = false;
  notSelectablePicks = true;
  weeksView = false;
  pickSuccess = null;
  stagedEdits = [] as Pick[];
  stagedDeletes = [] as Pick[];
  showEditButton = true;
  toggleType = "picks"
  loader = false;
  weekUserPicks = [] as any[];
  snapshot = new WeekPicks;

  @Input() otherUser = null;
  @Input() week = 0;
  @Input() seasonType = 0;
  @Input() season = 0;

  @Input() subNavEditClicked = false;
  @Input() subNavSubmitEdit = false;
  @Input() subPicksSubmit = false;

  @Output() title = new EventEmitter();
  @Output() displayEditButton = new EventEmitter();
  @Output() picksUpdated = new EventEmitter();
  @Output() peekUser = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar, 
    private pickService: PickService,
    private teamService: TeamService, 
    private dateFormatter: DateFormatterService,
    private authService:AuthenticationService) {}

  ngOnInit() {
    if(this.otherUser != null) {
      this.toggleType = "none";
    }
  }

  ngOnChanges(changes: SimpleChange) {

    if(changes["subNavEditClicked"]?.currentValue) {
      this.editPicks();
    }

    if(changes["subNavSubmitEdit"]?.currentValue) {
      this.submitEdits();
    }

    if(changes["week"]?.currentValue != changes["week"]?.previousValue && changes["week"]?.currentValue != 0) {
      this.loader = true;
      this.initWeek(this.season, this.seasonType, this.week, false);
    }

    if(changes["subPicksSubmit"]?.currentValue) {
      this.initWeek(this.season, this.seasonType, this.week, false);
    }
  }

  initWeek(season: number, seasonType: number, week: number, reset: boolean) {
    this.loader = true;
    this.myTeams = [] as Team[];
    this.myGames = [] as Game[];
    this.stagedEdits = [] as Pick[];
    this.stagedDeletes = [] as Pick[];
    this.picks = [] as Pick[];
    this.weekObject.number = week;
    this.weekObject.season = season;
    this.weekObject.seasonType = seasonType;
    
    this.pickService.getWeekPicksByGame(season, seasonType, week).subscribe(result => {
      this.weekUserPicks = result;
      this.getPicksByWeek(season, seasonType, week, reset);
    });
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
        this.pickService.getPicksByWeek(this.authService.currentUserValue, season, seasonType, week).subscribe( picks => {  
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
    this.getTitle();
    this.loader = false;

    this.myGames.forEach((game) => {
      if(new Date(game.pick_submit_by_date) > new Date()) {
        this.displayEditButton.emit(true);
        this.showEditButton = true;
      } else {
        this.displayEditButton.emit(false);
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
      this.picksUpdated.emit(true);
      this.editPicks();
    } else if(editPastSubmit) { 
      this.picksUpdated.emit(true);
      const dialogError = this.dialog.open(PicksEditErrorDialog,{width: '500px'});
      dialogError.afterClosed().subscribe(result => {
        if(result) {
          this.editPicks();
          this.initWeek(this.weekObject.season, this.weekObject.seasonType, this.weekObject.number, true);
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
      this.snackBar.open("edits submitted",'', {duration:3000, panelClass:["success-snack", "quaternary-background", "secondary"]});
      this.picksUpdated.emit(true);
      this.editPicks();
      this.initWeek(this.weekObject.season, this.weekObject.seasonType, this.weekObject.number, false);
    });
  }

  updatePicks(): Promise<any> {
    let promises_array:Array<any> = [];
    for(let i = 0; i < this.stagedEdits.length; i++) {
      promises_array.push(new Promise((resolve, reject)=>{
        this.pickService.updatePick(this.stagedEdits[i]).subscribe((success) => {
          if(!success){reject();}
          resolve(null);
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
          resolve(null);
        });
      }));
    }
    return Promise.all(promises_array);
  }

  getPickByGame(game: Game): Pick {
    for(var i = 0; i < this.picks.length; i++) {
      if(this.picks[i].game_id === game.game_id) {
        return this.picks[i];
      }
    }
    return null;
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

  getTitle() {
    let title = "";
    title += this.myGames.length + " Picked"
    this.title.emit(title);
  }

  peekUserSelected(event){
    this.peekUser.emit(event);
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
