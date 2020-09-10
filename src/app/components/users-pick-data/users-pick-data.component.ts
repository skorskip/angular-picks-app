import { Component, OnInit, Input } from '@angular/core';
import { Game } from 'src/app/data-models/game/game';
import { PickService } from 'src/app/data-models/pick/pick.service';
import { Pick } from 'src/app/data-models/pick/pick';
import { PickData } from 'src/app/data-models/pick/pick-data';

@Component({
  selector: 'users-pick-data',
  templateUrl: './users-pick-data.component.html',
  styleUrls: ['./users-pick-data.component.css']
})
export class UsersPickDataComponent implements OnInit {

  @Input() picks = [] as PickData[];
  @Input() game = new Game();
  showPickers = false;
  awayPicks = [] as PickData[];
  homePicks = [] as PickData[];

  constructor(
    private pickService: PickService
  ) { }

  ngOnInit() {
      this.setPickArrays(this.picks);
  }

  picksDataClick(){
    this.showPickers = !this.showPickers;
  }

  setPickArrays(picks: PickData[]) {
    for(var i = 0; i < picks.length; i++){
      if(picks[i].team_id == this.game.away_team_id) {
        this.awayPicks.push(picks[i]);
      } else {
        this.homePicks.push(picks[i]);
      }
    }
  }

}
