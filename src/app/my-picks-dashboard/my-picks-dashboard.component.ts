import { Component, OnInit } from '@angular/core';
import { PickService } from '../data-models/pick/pick.service';
import { GameService } from '../data-models/game/game.service';
import { TeamService } from '../data-models/team/team.service';
import { Game } from '../data-models/game/game';
import { Team } from '../data-models/team/team';
import { Pick } from '../data-models/pick/pick';

@Component({
  selector: 'app-my-picks-dashboard',
  templateUrl: './my-picks-dashboard.component.html',
  styleUrls: ['./my-picks-dashboard.component.css']
})
export class MyPicksDashboardComponent implements OnInit {
  myGames: Game[];
  myTeams: Team[];
  selectedTeams: Team[];
  picks: Pick[];
  constructor(private pickService: PickService, private gameService: GameService, private teamService: TeamService) { }

  ngOnInit() {
    this.getPicks();
  }

  getPicks() {
    this.picks = this.pickService.getPicks();
    var gameIds: number[] = [];
    var teamIds: number[] = [];
    this.picks.forEach(element => {
      gameIds.push(element.gameId);
    });
    this.myGames = this.gameService.getGameByIds(gameIds);
    console.log(this.myGames);

    this.myGames.forEach(element => {
        teamIds.push(element.awayTeam);
        teamIds.push(element.awayTeam);
    });
    this.myTeams = this.teamService.getTeamByIds(teamIds);

  }

}
