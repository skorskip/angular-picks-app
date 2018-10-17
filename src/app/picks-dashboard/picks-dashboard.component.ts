import { Component, OnInit } from '@angular/core';
import { Game } from '../data-models/game/game';
import { Team } from '../data-models/team/team';  
import { GameService } from '../data-models/game/game.service';
import { TeamService } from '../data-models/team/team.service';

@Component({
  selector: 'app-picks-dashboard',
  templateUrl: './picks-dashboard.component.html',
  styleUrls: ['./picks-dashboard.component.css']
})
export class PicksDashboardComponent implements OnInit {
	
  games: Game[] = [];
  teams: Team[] = [];
  selectedTeam;
  constructor(private gameService: GameService, private teamService: TeamService) { }

  ngOnInit() {
    this.getGames();
    this.getTeams();
  }

  getGames(): void  {
  	this.gameService.getGames()
      .subscribe(games => this.games = games);
  }

  getTeams(){
    this.teams = this.teamService.getTeams();
  }

  getBorderColor(id:number) {
    var team = this.getTeam(id);
    var shadowColor = team.primaryColor.substring(0, team.primaryColor.lastIndexOf("1")) + ".7)"
    return {
      'border-color' : shadowColor,
      'box-shadow': '0 4px 20px 0 rgba(0,0,0,.14), 0 7px 10px -5px ' + shadowColor
    }
  }

  selectTeam(id:number) {
    var team = this.getTeam(id);
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

}
