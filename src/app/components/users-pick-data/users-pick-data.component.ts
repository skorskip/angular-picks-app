import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Game } from 'src/app/data-models/game/game';
import { PickData } from 'src/app/data-models/pick/pick-data';
import { PickModalService } from 'src/app/services/pick-modal/pick-modal.service';

@Component({
  selector: 'users-pick-data',
  templateUrl: './users-pick-data.component.html',
  styleUrls: ['./users-pick-data.component.css']
})
export class UsersPickDataComponent implements OnInit {

  @Input() picks = [] as PickData[];
  @Input() game = new Game();
  @Input() selectable = true;
  showPickers = false;
  awayPicks = [] as PickData[];
  homePicks = [] as PickData[];

  constructor(private pickModalServie: PickModalService) { }

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
    this.pickModalServie.setPickModalVisibility(user);
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
