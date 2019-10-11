import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Game } from '../../data-models/game/game';
import { Team } from '../../data-models/team/team';
import { TeamService } from '../../data-models/team/team.service';
import { Pick } from '../../data-models/pick/pick';
import { DateFormatterService } from '../../services/date-formatter.service';
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
  @Output() teamLoaded = new EventEmitter();
  
  submitDate = "";
  teams: Team[] = [];
  constructor(
    private teamService: TeamService, 
    private dateFormatter: DateFormatterService) { }

  ngOnInit(){
    this.submitDate = this.dateFormatter.formatDate(new Date(this.game.pick_submit_by_date));
    this.getTeamsInit(this.game);
  }

  teamLoadedEvent(event) {
    this.teamLoaded.emit(this.game);
  }

  selectTeam(selectedTeamId:number) {
    if(this.notSelectablePicks  || (this.game.game_status != 'UNPLAYED')){   
    } else {
      
      var selectedTeam = this.getTeam(selectedTeamId);
      var otherTeamId = this.game.home_team == selectedTeamId ? this.game.away_team : this.game.home_team;
      
      this.stageSelectedPick.emit(this.stagePick(selectedTeamId, this.game.game_id));
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
    stagedPick.game_id = gameId;
    stagedPick.team_id = teamId;
    return stagedPick;
  }

  unSelectTeam(teamId:number){
    var team = document.getElementById(teamId + "-team-card");
    var selectedTeam = this.getTeam(teamId);
    team.style.backgroundColor = "";
    team.style.color = selectedTeam.primary_color;
    team.classList.add("body-color-secondary")
    team.classList.remove("selectedTeam");
  }

  highlightSelectTeam(team:Team){
    var teamElement = document.getElementById(team.team_id + "-team-card");
    teamElement.classList.remove("body-color-secondary");
    teamElement.style.background = team.primary_color;
    teamElement.style.color = "white";
    teamElement.classList.add("selectedTeam"); 
  }
  
  getTeamsInit(game:Game) {
    var teamIds: number[] = [];
    teamIds.push(game.home_team);
    teamIds.push(game.away_team);
    this.teamService.getTeamByIds(teamIds).subscribe(
      teams => this.teams = teams
    );
  }

  gameLocked():boolean {
    return new Date(this.game.pick_submit_by_date) > new Date()
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
      if(id == teamItem.team_id){
        team = teamItem;
      }
    })
    return team;
  }
}

