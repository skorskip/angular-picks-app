import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Game } from '../../data-models/game/game';
import { Week } from '../../data-models/week/week';
import { WeekService } from '../../data-models/week/week.service';
import { Pick } from '../../data-models/pick/pick';
import { PickService } from '../../data-models/pick/pick.service';
import { WeeksService } from '../../components/weeks/weeks.service';
import { Subscription }   from 'rxjs';
import { User } from 'src/app/data-models/user/user';
import { UserService } from 'src/app/data-models/user/user.service';


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

  constructor(
    public dialog: MatDialog, 
    private weekService: WeekService, 
    private pickService: PickService, 
    public snackBar: MatSnackBar, 
    private router:Router,
    private weeksService:WeeksService,
    private userService:UserService) { 
      this.subscription = this.weeksService.weekSelected$.subscribe(weekSeason => this.initWeek(weekSeason));
    }

  ngOnInit() {
    this.user = this.userService.currentUser;
    this.weekService.getCurrentWeek().subscribe(currentWeek => this.initWeek(currentWeek));
  }

  initWeek(week: Week) {
    this.week = week;
    this.games = week.games;
    this.removePickedGames();
  }

  teamLoaded(event) {
    this.highlightGameResult(event);
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
    this.submitOpened = opened;
    this.showSubmit();
  }

  showSubmit() {
    if(this.submitOpened){
      document.getElementById("submit-container").style.right = "0px";
      this.submitOpened = false;
    }else{
      document.getElementById("submit-container").style.right = "-150px";
      this.submitOpened = true;
    }
  }

  stageSelectedPick(selectedPick: Pick){
    var pickAdded = false;
    this.stagedPicks.forEach((stagedPick, i) =>{
      if(stagedPick.game_id == selectedPick.game_id) {
        if(stagedPick.team_id == selectedPick.team_id) {
          this.stagedPicks.splice(i, 1);
        } else this.stagedPicks.splice(i, 1, selectedPick);
        pickAdded = true;
      }
    });
    if(!pickAdded){
      selectedPick.user_id = this.user.user_id;
      this.stagedPicks.push(selectedPick);
    }
  }
  
  openDialog() {
    if(this.stagedPicks.length == 0){
      const dialogRef = this.dialog.open(NoPicksDialog);
    } else {
      const dialogRef = this.dialog.open(SubmitPicksDialog);
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.pickService.addPicks(this.stagedPicks).subscribe(status => {
            if(status) {
              this.snackBar.open("picks submitted", "",{duration: 2000});
              this.router.navigate(['/myPicks/' + this.week.season + '/' + this.week.number]);
            } else {
              const dialogRef = this.dialog.open(PicksErrorDialog);
            }
          });
        }
      });
    }
  }

  highlightGameResult(game){
    if(game.status == 'COMPLETED'){
      if(game.homeScore + game.spread >= game.awayScore){
        document.getElementById(game.homeTeam + "-team-card").classList.remove("body-color-secondary");
        document.getElementById(game.homeTeam + "-team-card").classList.add("highlight-border");
      }
      else if(game.homeScore + game.spread < game.awayScore) {
        document.getElementById(game.awayTeam + "-team-card").classList.remove("body-color-secondary");
        document.getElementById(game.awayTeam + "-team-card").classList.add("highlight-border");
      }
    }
  }

  showSubmitTime(index: number): boolean {
    if((index == 0) || this.games[index - 1].pick_submit_by_date != this.games[index].pick_submit_by_date){
      return true;
    }
    else return false;
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
