import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Game } from '../../data-models/game/game';
import { Team } from '../../data-models/team/team';
import { Pick } from '../../data-models/pick/pick';
import { DateFormatterService } from '../../services/date-formatter/date-formatter.service';
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
  @Input() teams: Team[] = [];
  @Output() openSubmit = new EventEmitter<boolean> ();
  @Output() stageSelectedPick = new EventEmitter ();
  @Output() teamLoaded = new EventEmitter();
  
  submitDate = "";
  home_team = new Team();
  away_team = new Team();
  
  constructor(
    private dateFormatter: DateFormatterService) { }

  ngOnInit(){
    this.setTeams(this.game, this.teams);
    this.submitDate = this.dateFormatter.formatDate(new Date(this.game.pick_submit_by_date));
  }

  teamLoadedEvent(event) {
    this.teamLoaded.emit(this.game);
  }

  selectTeam(selectedTeam:Team) {
    if(this.notSelectablePicks){
    } else if(new Date(this.game.pick_submit_by_date) > new Date()){

      var otherTeam = this.game.home_team == selectedTeam.team_id ? this.away_team : this.home_team;
      
      this.stageSelectedPick.emit(this.stagePick(selectedTeam.team_id, this.game.game_id));
      this.openSubmit.emit(true);
      
      if(document.getElementById(selectedTeam.team_id + "-team-card").classList.contains("selectedTeam")){
        this.unSelectTeam(selectedTeam);
      } else if(document.getElementById(otherTeam.team_id + "-team-card").classList.contains("selectedTeam")){
        this.unSelectTeam(otherTeam);
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
    stagedPick.submitted_date = new Date();
    return stagedPick;
  }

  unSelectTeam(selectedTeam:Team){
    var team = document.getElementById(selectedTeam.team_id + "-team-card");
    team.style.backgroundColor = "";
    team.style.color = selectedTeam.primary_color;
    team.classList.add("base-background")
    team.classList.remove("selectedTeam");
  }

  highlightSelectTeam(team:Team){
    var teamElement = document.getElementById(team.team_id + "-team-card");
    teamElement.classList.remove("base-background");
    teamElement.style.background = team.primary_color;
    teamElement.style.color = "white";
    teamElement.classList.add("selectedTeam"); 
  }

  timeStatus() {
    if(this.game.game_status == "UNPLAYED" || this.game.game_status == null) {
      if(this.showSubmitTime) {
        return "Submit by: " + this.submitDate;
      } else if(new Date(this.game.pick_submit_by_date) < new Date()){
        return "Start time: " + this.dateFormatter.formatDate(new Date(this.game.start_time));
      }
    } else {
      if(this.game.game_status == "COMPLETED") {
        return "Final";
      } else {
        var minutes = String(Math.floor(this.game.seconds_left_in_quarter / 60));
        var seconds = String(this.game.seconds_left_in_quarter % 60);
       
        if(parseInt(seconds) < 10) { seconds = "0" + seconds}

        if(parseInt(minutes) == 0 && parseInt(seconds) == 0 && this.game.current_quarter != 2) { 
          return "Q" + this.game.current_quarter + " - END";
        } else if(parseInt(minutes) == 0 && parseInt(seconds) == 0 && this.game.current_quarter == 2) {
          return "HALFTIME"
        } else {
          return "Q" + this.game.current_quarter + " - " + minutes + ":" + seconds;
        }
      }
    }
  }

  gameLocked():boolean {
    return new Date(this.game.pick_submit_by_date) > new Date();
  }

  getGameSpread(number:number) {
    if(number > 0) {
      return '+' + number;
    } else {
      return number;
    }
  }

  setTeams(game: Game, teams: Team[]) {
    for(var i = 0; i < teams.length; i++) {
      if(this.home_team.team_id != 0 && this.away_team.team_id != 0) {
        return;
      }
      if(game.home_team == teams[i].team_id){
        this.home_team = teams[i];

      } else if(game.away_team == teams[i].team_id) {
        this.away_team = teams[i];
      } 
    }
  }
}

