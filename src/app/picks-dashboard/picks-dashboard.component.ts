import { Component, OnInit, Inject } from '@angular/core';
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
  picks: Pick[] = [];
  pick = {} as Pick;
  week: Week;
  submitOpened = false;

  constructor(public dialog: MatDialog, private weekService: WeekService, private gameService: GameService,
    private teamService: TeamService, private pickService: PickService, public snackBar: MatSnackBar, @Inject(DOCUMENT) document) { }

  ngOnInit() {
    this.getWeekInfo();
  }

  getWeekInfo() {
    this.week = this.weekService.getWeek(100);
    this.games = this.gameService.getGameByIds(this.week.games);
    this.teams = this.teamService.getTeamByIds(this.week.teams);
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

  submitPicks():boolean {
    var selectedGameElem = document.getElementsByClassName("selectedGame");
    var selectedTeamElem = document.getElementsByClassName("selectedTeam");
    for(var i = 0; i < selectedGameElem.length; i++){
      var gameID = selectedGameElem[i].getAttribute("id");
      var teamID = selectedTeamElem[i].getAttribute("id");
      gameID = gameID.substring(0, gameID.indexOf("-"));
      teamID = teamID.substring(0, teamID.indexOf("-"));
      this.pick.gameId = parseInt(gameID);
      this.pick.teamId = parseInt(teamID);
      this.pick.weekId = this.week.id;
      this.pick.id += 1;
      console.log("pick", this.pick);
      this.picks.push(this.pick);      
    }
    console.log("Picks Submit:", this.picks);
    return this.pickService.addPicks(this.picks);
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(SubmitPicksDialog);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(this.submitPicks()){
          this.snackBar.open("picks submitted", "",{duration: 2000});
        }
      }
    });
  }

}

@Component({
  selector: 'submit-picks-dialog',
  templateUrl: '../dialog-content/submit-picks-dialog.html',
})
export class SubmitPicksDialog {}
