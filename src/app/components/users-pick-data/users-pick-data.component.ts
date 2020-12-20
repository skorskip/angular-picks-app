import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Game } from 'src/app/data-models/game/game';
import { PickData } from 'src/app/data-models/pick/pick-data';

@Component({
  selector: 'users-pick-data',
  templateUrl: './users-pick-data.component.html',
  styleUrls: ['./users-pick-data.component.css']
})
export class UsersPickDataComponent implements OnInit {

  @Input() picks = [] as PickData[];
  @Input() game = new Game();
  @Input() selectable = true;
  @Output() peekUser = new EventEmitter();
  showPickers = false;
  awayPicks = [] as PickData[];
  homePicks = [] as PickData[];

  constructor() { }

  ngOnInit() {
      this.setPickArrays(this.picks);
  }

  picksDataClick(){
    this.showPickers = true;
  }

  closePicksData() {
    this.showPickers = false;
  }

  setUserModal(user: PickData) {
    this.peekUser.emit(user)
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
