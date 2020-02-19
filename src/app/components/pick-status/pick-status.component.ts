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
  push = false;


  constructor(@Inject(DOCUMENT) document) { }

  ngOnInit() {}

  getPickStatus() {
    if(this.pickSuccess == null || this.pickSuccess == undefined){
      if(new Date(this.game.pick_submit_by_date) > new Date()) {
        this.open = true;
        return "base-background primary";
      } else {
        this.closed = true;
        return "base-background warn";
      }
    } else {
      if(this.pickSuccess == "WIN") {
        this.correct = true;
        return "base-background success";
      } else if (this.pickSuccess == "LOSE"){
        this.wrong = true;
        return "base-background failure";
      } else {
        this.push = true;
        return "base-background secondary";
      }
    }
  }
}
