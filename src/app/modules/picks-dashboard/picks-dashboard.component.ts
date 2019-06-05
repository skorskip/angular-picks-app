import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Game } from '../../data-models/game/game';
import { Week } from '../../data-models/week/week';
import { WeekService } from '../../data-models/week/week.service';
import { Pick } from '../../data-models/pick/pick';
import { PickService } from '../../data-models/pick/pick.service';
import { WeeksService } from '../../components/weeks/weeks.service';
import { Subscription }   from 'rxjs';


@Component({
  selector: 'app-picks-dashboard',
  templateUrl: './picks-dashboard.component.html',
  styleUrls: ['./picks-dashboard.component.css']
})

export class PicksDashboardComponent implements OnInit {
  games: Game[] = [] as Game[];
  stagedPicks: Pick[] = [] as Pick[];
  week: Week;
  weeks: Week[] = [] as Week[];
  submitOpened = false;
  weeksView = false;
  subscription: Subscription;

  constructor(
    public dialog: MatDialog, 
    private weekService: WeekService, 
    private pickService: PickService, 
    public snackBar: MatSnackBar, 
    private router:Router,
    private weeksService:WeeksService) { 
      this.subscription = this.weeksService.weekSelected$.subscribe(
        weekSeason => {
          this.getWeekInfo(weekSeason);
        }
      )
    }

  ngOnInit() {
    this.weekService.getCurrentWeek().subscribe(
      currentWeek => this.getWeekInfo(currentWeek)
    );
  }

  ngAfterViewInit() {
    this.games.forEach((game,i) => {
      var element = document.getElementById(game.id + "-game-card");
        element.style.animationDuration = (.5 + (i * 500)) + 'ms';
    });
    this.highlightGameResult();
  }

  getWeekInfo(week: Week) {
    console.log("week:", week);
    this.week = week;
    this.games = this.week.games;
    this.removePickedGames();
  }

  removePickedGames() {
    var picks = this.pickService.getPicksByWeek(this.week.season, this.week.number);
    picks.forEach(pick => {
      this.games.forEach((game, i) => {
        if(pick.gameId == game.id) {
          this.games.splice(i, 1);
        }
      })
    });
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
      if(stagedPick.gameId == selectedPick.gameId) {
        if(stagedPick.teamId == selectedPick.teamId) {
          this.stagedPicks.splice(i, 1);
        } else this.stagedPicks.splice(i, 1, selectedPick);
        pickAdded = true;
      }
    });
    if(!pickAdded){
      this.stagedPicks.push(selectedPick);
    }
  }

  submitPicks():boolean {
    return this.pickService.addPicks(this.stagedPicks);
  }
  
  openDialog() {
    if(this.stagedPicks.length == 0){
      const dialogRef = this.dialog.open(NoPicksDialog);
    } else {
      const dialogRef = this.dialog.open(SubmitPicksDialog);
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          if(this.submitPicks()){
            this.snackBar.open("picks submitted", "",{duration: 2000});
            this.router.navigate(['/myPicks/' + this.week.id]);
          }
        }
      });
    }
  }

  highlightGameResult(){
    this.games.forEach(game => {
      if(game.progress == 'FINAL'){
        var gameElement = document.getElementById(game.id + "-game-card");
        if(game.homeScore + game.spread > game.awayScore){
          document.getElementById(game.homeTeam + "-team-card").classList.remove("body-color-secondary");
          document.getElementById(game.homeTeam + "-team-card").classList.add("accent-color-primary");
        }
        else if(game.homeScore + game.spread < game.awayScore) {
          document.getElementById(game.homeTeam + "-team-card").classList.remove("body-color-secondary");
          document.getElementById(game.homeTeam + "-team-card").classList.add("accent-color-primary");
        }
        document.getElementById(game.id + "-game-card").classList.add("disabled");
      }
      if(game.progress == 'INPROGRESS') {
        document.getElementById(game.id + "-game-card").classList.add("disabled");
      }
    })

  }

  showSubmitTime(index: number): boolean {
    if((index == 0) || this.games[index - 1].submitDate != this.games[index].submitDate){
      return true;
    }
    else return false;
  }

  getGame(id: number): Game {
    var game
    this.games.forEach((gameItem) => {
      if(id == gameItem.id){
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
