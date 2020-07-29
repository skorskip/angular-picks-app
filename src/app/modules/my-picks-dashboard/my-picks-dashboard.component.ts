import { Component, OnInit, Input } from '@angular/core';
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
  @Input() otherUser = null;

  constructor(
    public dialog: MatDialog,
    private pickService: PickService,
    private teamService: TeamService, 
    private weeksService: WeeksService,
    private weekService: WeekService,
    private route:ActivatedRoute,
    private dateFormatter: DateFormatterService,
    private authService:AuthenticationService) { 
      this.subscription = this.weeksService.weekSelected$.subscribe(
        week => {
          this.initWeek(week.season, week.seasonType, week.week)
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
        this.initWeek(season, seasonType, week);
      });
    } else {
      this.initWeek(season, seasonType, week);
    }
  }

  initWeek(season, seasonType, week) {
    this.loader = true;
    this.myTeams = [] as Team[];
    this.myGames = [] as Game[];
    this.stagedEdits = [] as Pick[];
    this.stagedDeletes = [] as Pick[];
    this.week.number = week;
    this.week.season = season;
    this.week.seasonType = seasonType;

    this.pickService.getWeekPicksByGame(season, seasonType, week).subscribe(result => {
      this.weekUserPicks = result;
      this.getPicksByWeek(season, seasonType, week);
    });
  }

  teamLoaded(event) {
    this.highlightSelected(event);
  }

  getPicksByWeek(season: number, seasonType: number, week: number) {
    if(this.otherUser != null) {
      this.pickService.getUsersPicksByWeek(this.otherUser, season, seasonType, week).subscribe( picks => {  
        this.populateGamesTeams(picks);
      });
    } else {
      this.pickService.getPicksByWeek(this.user, season, seasonType, week).subscribe( picks => {  
        this.populateGamesTeams(picks);
      });
    }
  }

  populateGamesTeams(picks: WeekPicks){
    this.picks = picks.picks;
    this.myGames = picks.games;
    this.myTeams = picks.teams;
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
  }

  deletePick(game:Game) {
    for(let i = 0; i < this.myGames.length; i++) {
      if(this.myGames[i].game_id == game.game_id) {
        this.myGames.splice(i,1);
      }
    }

    this.picks.forEach(pick => {
      if(pick.game_id == game.game_id){
        this.stagedDeletes.push(pick);
      }
    }); 
  }

  changeTeam(game: Game) {
    if(this.edit && this.showEdit(game)) {
      this.picks.forEach(pick => {
        if(pick.game_id == game.game_id){
          this.teamService.unSelectTeam(this.teamService.getTeamLocal(pick.team_id, this.myTeams));
          var newTeam = pick.team_id == game.home_team_id ? game.away_team_id : game.home_team_id;
          var newPick = pick;
          newPick.team_id = newTeam;
          this.teamService.highlightSelectTeam(this.teamService.getTeamLocal(pick.team_id, this.myTeams));
          this.stagedEdits.push(newPick);
        }
      });
    }
  }

  submitEdits() {
    if(this.stagedDeletes.length == 0 && this.stagedEdits.length == 0){
      this.editPicks();
    } else {
      const dialogRef = this.dialog.open(EditPicksDialog,{width: '500px'});
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.editPicksService();
        } else {
          this.editPicks();
          this.initWeek(this.week.season, this.week.seasonType, this.week.number);
        }
      });
    }
  }

  editPicksService(){
    var updatePicks = this.updatePicks();
    var deletePicks = this.deletePicks();

    Promise.all([updatePicks, deletePicks]).then((results)=>{
      this.editPicks();
      this.initWeek(this.week.season, this.week.seasonType, this.week.number);
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
      if(pick.game_id == game.game_id){
        this.teamService.highlightSelectTeam(this.teamService.getTeamLocal(pick.team_id, this.myTeams));
      }
    });
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
  selector: 'edit-picks-dialog',
  templateUrl: '../../components/dialog-content/edit-picks-dialog.html'
})
export class EditPicksDialog {}
