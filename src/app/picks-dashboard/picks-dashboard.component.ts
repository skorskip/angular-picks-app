import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DOCUMENT } from '@angular/common';
import { Game } from '../data-models/game/game';
import { Team } from '../data-models/team/team';
import { Week } from '../data-models/week/week';
import { GameService } from '../data-models/game/game.service';
import { TeamService } from '../data-models/team/team.service';
import { WeekService } from '../data-models/week/week.service';
import { Pick } from '../data-models/pick/pick';
import { PickService } from '../data-models/pick/pick.service';

@Component({
  selector: 'app-picks-dashboard',
  templateUrl: './picks-dashboard.component.html',
  styleUrls: ['./picks-dashboard.component.css']
})

export class PicksDashboardComponent implements OnInit {
  games: Game[] = [];
  teams: Team[] = [];
  stagedPicks: Pick[] = [];
  week: Week;
  weeks: Week[] = [];
  submitOpened = false;
  weeksView = false;
  constructor(public dialog: MatDialog, private weekService: WeekService, private gameService: GameService,
    private teamService: TeamService, private pickService: PickService, public snackBar: MatSnackBar, 
    @Inject(DOCUMENT) document, private router:Router) { }

  ngOnInit() {
    this.getWeekInfo(this.weekService.getCurrentWeek());
  }

  ngAfterViewInit() {
    var delay = .5;
    this.games.forEach((game,i) => {
      var element = document.getElementById(game.id + "-game-card");
        element.style.animationDuration = (delay + (i * 500)) + 'ms';
    })  
  }

  getWeekInfo(week: Week) {
    this.week = week;
    this.games = this.gameService.getGameByIds(this.week.games);
    this.removePickedGames();
  }

  removePickedGames() {
    var picks = this.pickService.getPicksByWeek(this.week.id);
    picks.forEach(element => {
      this.games.forEach((game, i) => {
        if(element.gameId == game.id) {
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
    this.stagedPicks.forEach((element, i) =>{
      if(element.gameId == selectedPick.gameId && element.teamId == selectedPick.teamId) {
        this.stagedPicks.splice(i, 1);
        pickAdded = true;
      } else if(element.gameId == selectedPick.gameId) {
        this.stagedPicks.splice(i, 1, selectedPick);
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
            this.removePickedGames();
            this.snackBar.open("picks submitted", "",{duration: 2000});
            this.router.navigate(['/myPicks']);
          }
        }
      });
    }
  }

  showWeeks() {
    this.weeks = this.weekService.getWeeks();
    var element = document.getElementById("week-card");
    element.className = "week-out-animation";

    setTimeout(()=>{
      this.weeksView = true; 
    },500);
  }

  weekSelected(weekSelected:Week) {
    this.getWeekInfo(weekSelected);
    var element = document.getElementById("weeks-container");
    element.className = "week-out-animation";
    setTimeout(()=>{
      this.weeksView = false;
    },500);
  
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
