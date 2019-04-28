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

  constructor(@Inject(DOCUMENT) document) { }

  ngOnInit() {}

  ngAfterViewInit() {
    if(this.pickSuccess == null || this.pickSuccess == undefined){
      if(this.game.progress == "PENDING") {
        document.getElementById(this.game.id + "-pick-status").classList.add("pick-status-open");
      } else {
        document.getElementById(this.game.id + "-pick-status").classList.add("pick-status-close");
      }
    } else {
      if(this.pickSuccess == true) {
        document.getElementById(this.game.id + "-pick-status").classList.add("pick-status-success");
      } else {
        document.getElementById(this.game.id + "-pick-status").classList.add("pick-status-wrong");
      }
    }
  }
}
