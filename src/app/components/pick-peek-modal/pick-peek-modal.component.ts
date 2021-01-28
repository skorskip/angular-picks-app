import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Pick } from 'src/app/data-models/pick/pick';
import { PickService } from 'src/app/data-models/pick/pick.service';
import { Team } from 'src/app/data-models/team/team';
import { TeamService } from 'src/app/data-models/team/team.service';
import { slideUpAnimation, fadeAnimation } from 'src/app/animations/app-routing-animation';
import { CurrentWeek } from 'src/app/data-models/week/current-week';
import { Router } from '@angular/router';
import { Game } from 'src/app/data-models/game/game';

@Component({
  selector: 'app-pick-peek-modal',
  templateUrl: './pick-peek-modal.component.html',
  styleUrls: ['./pick-peek-modal.component.scss'],
  animations: [slideUpAnimation,fadeAnimation]
})
export class PickPeekModalComponent implements OnInit {

  @Input() firstname = "";
  @Input() lastname = "";
  @Input() inits = "";
  @Input() userId = 0;
  @Input() week = new CurrentWeek();
  @Output() close = new EventEmitter();
  @Output() viewFullPicks = new EventEmitter();

  teams = [] as Team[];
  picks = [] as Pick[];
  games = [] as Game[];
  gameObjects = [];
  displayTeams = [] as Team[];
  showLoader = false;
  showModal = false;

  constructor(
    private router:Router,
    private picksService: PickService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.showLoader = true;
    this.showModal = true;
    this.picksService.getUsersPicksByWeek(this.userId, this.week.season, this.week.seasonType, this.week.week).subscribe((result) => {
      this.teams = JSON.parse(JSON.stringify(result.teams));
      this.picks = JSON.parse(JSON.stringify(result.picks));
      this.games = JSON.parse(JSON.stringify(result.games));
      this.createGameObject(this.picks, this.teams, this.games);
    });
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    var modal = document.getElementById("modal-container");
    if((event.target == modal)) {
      this.showModal = false;
      this.close.emit(true);
    }
  }

  createGameObject(picks: Pick[], teams: Team[], games: Game[]) {
    picks.sort(this.gameSort);
    games.sort(this.gameSort);
    var list = [];
    for(var i = 0; i < games.length; i++) {
      var gameObject = {
        game: games[i],
        awayTeam: this.teamService.getTeamLocal(games[i].away_team_id, teams),
        homeTeam: this.teamService.getTeamLocal(games[i].home_team_id, teams),
        pick: picks[i]
      }

      list.push(gameObject);
    }
    this.gameObjects = list;
    this.showLoader = false;
  }

  viewPicks() {
    this.viewFullPicks.emit(this.userId);
    this.router.navigate(['/standings/'+ this.userId])
  }

  closeClick() {
    this.showModal = false;
    this.close.emit(true);
  }

  gameSort(a, b) {
    if(a.game_id > b.game_id) return 1;
    if(b.game_id > a.game_id) return -1;
    return 0;
  }
}
