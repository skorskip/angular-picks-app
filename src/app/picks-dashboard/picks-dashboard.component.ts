import { Component, OnInit } from '@angular/core';
import { Game } from '../data-models/game/game';
import { GameService } from '../data-models/game/game.service';

@Component({
  selector: 'app-picks-dashboard',
  templateUrl: './picks-dashboard.component.html',
  styleUrls: ['./picks-dashboard.component.css']
})
export class PicksDashboardComponent implements OnInit {
	
  games: Game[] = [];
  constructor(private gameService: GameService) { }

  ngOnInit() {
  	this.getGames();
  }

  getGames(): void  {
  	this.gameService.getGames()
      .subscribe(games => this.games = games);
  }

}
