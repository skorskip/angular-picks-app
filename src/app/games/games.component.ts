import { Component, OnInit, Inject, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Game } from '../data-models/game/game';
import { Team } from '../data-models/team/team';
import { PickService } from '../data-models/pick/pick.service';
import { GameService } from '../data-models/game/game.service';
import { TeamService } from '../data-models/team/team.service';
import { Pick } from '../data-models/pick/pick';
import { ICON_REGISTRY_PROVIDER } from '@angular/material';
import { MatDialog } from '@angular/material';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
	
  @Input() games: Game[];
  @Input('submitOpened') submitOpened: boolean;
  @Output() openSubmit = new EventEmitter<boolean> ();
  @Output() stageSelectedPick = new EventEmitter ();
  selectablePicks = true;
  teams: Team[];
  editMode = false;
  constructor(private gameService: GameService, private teamService: TeamService, @Inject(DOCUMENT) document, private pickService: PickService) { }

  ngOnInit(){
    this.getTeamsInit(this.games);
  }

  ngAfterViewInit() {
    this.highLightSelected();
  }

  highLightSelected(){
    var picks = this.pickService.getPicks();
    picks.forEach(element =>{
      this.games.forEach(game => {
        if(game.id == element.gameId){
          this.selectablePicks = false;
          this.highlightSelectTeam(this.getTeam(element.teamId));
        }
      })
    })
  }

  getBorderColor(id:number) {
    var team = this.getTeam(id);
    var shadowColor = team.secondaryColor.substring(0, team.secondaryColor.lastIndexOf("1")) + ".7)"
    return {
      'border-color' : team.primaryColor,
      'box-shadow': '0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px ' + shadowColor
    }
  }

  selectTeam(selectedTeamId:number, game:Game) {
    if(this.selectablePicks){
      var selectedTeam = this.getTeam(selectedTeamId);
      var otherTeamId = game.homeTeam == selectedTeamId ? game.awayTeam : game.homeTeam;
      this.stageSelectedPick.emit(this.stagePick(selectedTeamId, game.id));
      if(this.editMode){
        //auto update pick through pick service, not staged
        this.highLightSelected();
      }
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
    team.style.backgroundColor = "white";
    team.style.color = "";
    team.classList.remove("selectedTeam");
  }

  highlightSelectTeam(team:Team){
    var teamElement = document.getElementById(team.id + "-team-card");
    teamElement.style.backgroundColor = team.primaryColor;
    teamElement.style.color = "white";
    teamElement.classList.add("selectedTeam");
  }

  getTeamsInit(games:Game[]) {
    var teamIds: number[] = [];
    games.forEach(element => {
      teamIds.push(element.homeTeam);
      teamIds.push(element.awayTeam);
    });
    this.teams = this.teamService.getTeamByIds(teamIds);
  }

  getTeamName(id:number) {
    var team = this.getTeam(id);
    return team.abbrevation;
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

  getGame(id : number): Game {
    var game
    this.games.forEach((gameItem) => {
      if(id == gameItem.id){
        game = gameItem;
      }
    })
    return game;
  }
}

