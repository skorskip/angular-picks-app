import { Component, OnInit, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'pick-status',
  templateUrl: './pick-status.component.html',
  styleUrls: ['./pick-status.component.css']
})
export class PickStatusComponent implements OnInit {

  @Input() game;
  @Input() pickSuccess = null;
  closed = false;
  open = false;
  correct = false;
  wrong = false;


  constructor(@Inject(DOCUMENT) document) { }

  ngOnInit() {}

  getPickStatus() {
    if(this.pickSuccess == null || this.pickSuccess == undefined){
      if(this.game.progress == "PENDING") {
        this.open = true;
        return "pick-status-open";
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
