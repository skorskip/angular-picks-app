import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DOCUMENT } from '@angular/common';
import { Game } from '../data-models/game/game';
import { Team } from '../data-models/team/team';
import { Week } from '../data-models/week/week';
import { GameService } from '../data-models/game/game.service';
import { WeekService } from '../data-models/week/week.service';
import { Pick } from '../data-models/pick/pick';
import { PickService } from '../data-models/pick/pick.service';
import { WeeksService } from '../weeks/weeks.service';
import { Subscription }   from 'rxjs';


@Component({
  selector: 'app-picks-dashboard',
  templateUrl: './picks-dashboard.component.html',
  styleUrls: ['./picks-dashboard.component.css']
})

export class PicksDashboardComponent implements OnInit {
  games: Game[] = [];
  stagedPicks: Pick[] = [];
  week: Week;
  weeks: Week[] = [];
  submitOpened = false;
  weeksView = false;
  subscription: Subscription;

  constructor(
    public dialog: MatDialog, 
    private weekService: WeekService, 
    private gameService: GameService,
    private pickService: PickService, 
    public snackBar: MatSnackBar, 
    @Inject(DOCUMENT) document, 
    private router:Router,
    private weeksService:WeeksService) { 
      this.subscription = this.weeksService.weekSelected$.subscribe(
        weekId => {
          this.weekSelected(weekId);
        }
      )
    }

  ngOnInit() {
    this.getWeekInfo(this.weekService.getCurrentWeek());
  }

  ngAfterViewInit() {
    this.games.forEach((game,i) => {
      var element = document.getElementById(game.id + "-game-card");
        element.style.animationDuration = (.5 + (i * 500)) + 'ms';
    });
    this.highlightGameResult();
  }

  getWeekInfo(week: Week) {
    this.week = week;
    this.games = this.gameService.getGameByIds(this.week.games);
    this.removePickedGames();
  }

  removePickedGames() {
    var picks = this.pickService.getPicksByWeek(this.week.id);
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
    selectedPick.weekId = this.week.id;
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

  showWeeks() {
    var element = document.getElementById("week-card");
    element.className = "week-out-animation";
    setTimeout(()=>{
      this.weeksView = true; 
    },500);
  }

  weekSelected(weekId:number) {
    this.getWeekInfo(this.weekService.getWeek(weekId));
    var element = document.getElementById("weeks-container");
    element.className = "week-out-animation";
    setTimeout(()=>{
      this.weeksView = false;
      setTimeout(()=>{
        this.ngAfterViewInit();
      })
    },500);
  }

  highlightGameResult(){
    this.games.forEach(game => {
      if(game.progress == 'FINAL'){
        var gameElement = document.getElementById(game.id + "-game-card");
        if(game.homeScore + game.spread > game.awayScore){
          document.getElementById(game.homeTeam + "-team-card").style.background = "linear-gradient(to right, #f857a6, #ff5858)";
          document.getElementById(game.homeTeam + "-team-card").style.color = "white";
        }
        else if(game.homeScore + game.spread < game.awayScore) {
          document.getElementById(game.awayTeam + "-team-card").style.background = "linear-gradient(to right, #f857a6, #ff5858)";
          document.getElementById(game.homeTeam + "-team-card").style.color = "white";

        }
        document.getElementById(game.id + "-game-card").style.backgroundColor = "#ff5858";
      }
      if(game.progress == 'INPROGRESS') {
        document.getElementById(game.id + "-game-card").style.backgroundColor = "#f857a6";
      }
    })

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
  templateUrl: '../dialog-content/no-picks-dialog.html',
})
export class NoPicksDialog {}

@Component({
  selector: 'submit-picks-dialog',
  templateUrl: '../dialog-content/submit-picks-dialog.html',
})
export class SubmitPicksDialog {}
