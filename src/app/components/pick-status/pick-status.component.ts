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

  ngOnInit() {
    this.getPickStatus();
  }

  getPickStatus() {
    if(this.pickSuccess == null || this.pickSuccess == undefined){
      if(new Date(this.game.pick_submit_by_date) > new Date()) {
        this.open = true;
      } else {
        this.closed = true;
      }
    } else {
      if(this.pickSuccess == "WIN") {
        this.correct = true;
      } else if (this.pickSuccess == "LOSE"){
        this.wrong = true;
      } else {
        this.push = true;
      }
    }
  }
}
