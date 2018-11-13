import { Component, OnInit, Inject, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Game } from '../data-models/game/game';
import { Team } from '../data-models/team/team';
import { PickService } from '../data-models/pick/pick.service';
import { GameService } from '../data-models/game/game.service';
import { TeamService } from '../data-models/team/team.service';
import { Pick } from '../data-models/pick/pick';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
	
  @Input() game: Game;
  @Input('submitOpened') submitOpened: boolean;
  @Output() openSubmit = new EventEmitter<boolean> ();
  @Output() stageSelectedPick = new EventEmitter ();
  @Input() notSelectablePicks = false;
  teams: Team[];
  constructor(private gameService: GameService, private teamService: TeamService, @Inject(DOCUMENT) document, private pickService: PickService) { }

  ngOnInit(){
    this.getTeamsInit(this.game);
  }

  getBorderColor(id:number) {
    var team = this.getTeam(id);
    var shadowColor = team.secondaryColor.substring(0, team.secondaryColor.lastIndexOf("1")) + ".7)"
    return {
      'border-color' : team.primaryColor,
      'box-shadow': '0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px ' + shadowColor
    }
  }

  selectTeam(selectedTeamId:number) {
    if(this.notSelectablePicks  || (this.game.progress != 'PENDING')){   
    } else {
      var selectedTeam = this.getTeam(selectedTeamId);
      var otherTeamId = this.game.homeTeam == selectedTeamId ? this.game.awayTeam : this.game.homeTeam;
      this.stageSelectedPick.emit(this.stagePick(selectedTeamId, this.game.id));
      this.openSubmit.emit(true);
      if(document.getElementById(selectedTeamId + "-team-card").classList.contains("selectedTeam")){
        this.unSelectTeam(selectedTeamId);
      } else if(document.getElementById(otherTeamId + "-team-card").classList.contains("selectedTeam")){
        this.unSelectTeam(otherTeamId);
        this.highlightSelectTeam(selectedTeam);
      } else {
        this.highlightSelectTeam(selectedTeam);
      }
    }
  }

  stagePick(teamId:number, gameId:number){
    var stagedPick = {} as Pick;
    stagedPick.gameId = gameId;
    stagedPick.teamId = teamId;
    return stagedPick;
  }

  unSelectTeam(teamId:number){
    var team = document.getElementById(teamId + "-team-card");
    team.style.backgroundColor = "";
    team.style.color = "";
    team.classList.add("body-color-secondary")
    team.classList.remove("selectedTeam");
  }

  highlightSelectTeam(team:Team){
    var teamElement = document.getElementById(team.id + "-team-card");
    teamElement.classList.remove("body-color-secondary");
    teamElement.style.background = team.primaryColor;
    teamElement.style.color = "white";
    teamElement.classList.add("selectedTeam");
    
  }
  

  getTeamsInit(game:Game) {
    var teamIds: number[] = [];
    teamIds.push(game.homeTeam);
    teamIds.push(game.awayTeam);
    this.teams = this.teamService.getTeamByIds(teamIds);
  }

  getTeamName(id:number) {
    var team = this.getTeam(id);
    return team.abbrevation;
  }

  getGameSpread(number:number) {
    if(number > 0) {
      return '+' + number;
    } else {
      return number;
    }
  }

  getTeam(id: number): Team {
    var team
    this.teams.forEach((teamItem) => {
      if(id == teamItem.id){
        team = teamItem;
      }
    })
    return team;
  }
}

