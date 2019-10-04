import { Component, OnInit, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Game } from '../../data-models/game/game';

@Component({
  selector: 'pick-status',
  templateUrl: './pick-status.component.html',
  styleUrls: ['./pick-status.component.css']
})
export class PickStatusComponent implements OnInit {

  @Input() game = new Game();
  @Input() pickSuccess = null;
  closed = false;
  open = false;
  correct = false;
  wrong = false;


  constructor(@Inject(DOCUMENT) document) { }

  ngOnInit() {}

  getPickStatus() {
    if(this.pickSuccess == null || this.pickSuccess == undefined){
      if(this.game.status == "UNPLAYED") {
        this.open = true;
        return "pick-status-open accent-primary";
      } else {
        this.closed = true;
        return "pick-status-close";
      }
    } else {
      if(this.pickSuccess == true) {
        this.correct = true;
        return "pick-status-success";
      } else {
        this.wrong = true;
        return "pick-status-wrong";
      }
    }
  }
}
