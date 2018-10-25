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
  submitOpened = false;

  constructor(public dialog: MatDialog, private weekService: WeekService, private gameService: GameService,
    private teamService: TeamService, private pickService: PickService, public snackBar: MatSnackBar, 
    @Inject(DOCUMENT) document, private router:Router) { }

  ngOnInit() {
    this.getWeekInfo();
  }

  getWeekInfo() {
    this.week = this.weekService.getWeek(100);
    this.games = this.gameService.getGameByIds(this.week.games);
    this.removePickedGames();
  }

  removePickedGames() {
    var picks = this.pickService.getPicks();
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
      document.getElementById("submit-container").style.left = "75%";
      this.submitOpened = false;
    }else{
      document.getElementById("submit-container").style.left = "95%";
      this.submitOpened = true;
    }
  }

  stageSelectedPick(selectedPick: Pick){
    selectedPick.weekId = 100;
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
