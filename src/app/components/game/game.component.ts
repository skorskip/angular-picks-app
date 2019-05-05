import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Game } from '../../data-models/game/game';
import { Team } from '../../data-models/team/team';
import { TeamService } from '../../data-models/team/team.service';
import { Pick } from '../../data-models/pick/pick';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
	
  @Input() game: Game;
  @Input('submitOpened') submitOpened: boolean;
  @Input() showSubmitTime: boolean;
  @Input() notSelectablePicks = false;
  @Input() pickSuccess = null;
  @Output() openSubmit = new EventEmitter<boolean> ();
  @Output() stageSelectedPick = new EventEmitter ();

  teams: Team[];
  constructor(private teamService: TeamService) { }

  ngOnInit(){
    this.getTeamsInit(this.game);
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
    var selectedTeam = this.getTeam(teamId);
    team.style.backgroundColor = "";
    team.style.color = selectedTeam.primaryColor;
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

