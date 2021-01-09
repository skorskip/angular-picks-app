import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Game } from '../../data-models/game/game';
import { Team } from '../../data-models/team/team';
import { Pick } from '../../data-models/pick/pick';
import { DateFormatterService } from '../../services/date-formatter/date-formatter.service';
import { TeamService } from 'src/app/data-models/team/team.service';
import { PickData } from 'src/app/data-models/pick/pick-data';
@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
	
  @Input() game: Game;
  @Input('submitOpened') submitOpened: boolean;
  @Input() notSelectablePicks = false;
  @Input() pick: Pick;
  @Input() teams: Team[] = [];
  @Input() userGamePicks: PickData[] = [];
  @Output() stageSelectedPick = new EventEmitter ();
  
  submitDate = "";
  home_team_id = new Team();
  away_team_id = new Team();
  showPickers = false;
  home_highlight = false;
  away_highlight = false;
  
  constructor(
    private dateFormatter: DateFormatterService) { }

  ngOnInit(){
    this.setTeams(this.game, this.teams);
    this.submitDate = this.dateFormatter.formatDate(new Date(this.game.pick_submit_by_date));
    this.highlightPick();
  }

  selectTeam(selectedTeam:Team) {
    if(!this.notSelectablePicks && new Date(this.game.pick_submit_by_date) > new Date()){

      this.stageSelectedPick.emit(this.stagePick(selectedTeam.team_id, this.game.game_id));

      if(this.home_highlight){
        this.home_highlight = false;
        if(selectedTeam.team_id == this.away_team_id.team_id) {
          this.away_highlight = true;
        }
      } else if (this.away_highlight){
        this.away_highlight = false;
        if(selectedTeam.team_id == this.home_team_id.team_id) {
          this.home_highlight = true;
        }
      } else {
        if(this.game.home_team_id == selectedTeam.team_id) {
          this.home_highlight = true;
        } else {
          this.away_highlight = true;
        }
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

  submitStatus() {
    return new Date(this.game.pick_submit_by_date) <= new Date();
  }

  showPicksData() {
    return new Date(this.game.pick_submit_by_date) <= new Date();
  }

  timeStatus() {
    if(this.game.game_status == "UNPLAYED" || this.game.game_status == null) {
      if(new Date(this.game.pick_submit_by_date) < new Date()){
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

  setTeams(game: Game, teams: Team[]) {
    for(var i = 0; i < teams.length; i++) {
      if(this.home_team_id.team_id != 0 && this.away_team_id.team_id != 0) {
        return;
      }
      if(game.home_team_id == teams[i].team_id){
        this.home_team_id = teams[i];

      } else if(game.away_team_id == teams[i].team_id) {
        this.away_team_id = teams[i];
      } 
    }
  }

  picksDataClick(){
    this.showPickers = !this.showPickers;
  }

  pickResult():string {
    if(this.game.game_status == 'COMPLETED' && this.pick != null){
      if(this.pick.team_id == this.game.winning_team_id) {
        return "WIN";
      } else if(this.game.winning_team_id == null) {
        return "PUSH";
      } else {
        return "LOSE";
      }
    }
    else {
      return null;
    }
  }

  highlightPick() {
    if(this.pick != null) {
      if(this.game.away_team_id === this.pick.team_id) {
        this.away_highlight = true;
      } else {
        this.home_highlight = true;
      }
    }
  }
}

