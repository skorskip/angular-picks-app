import { Component, OnInit, Input, Inject, Output, AfterViewInit, EventEmitter, AfterViewChecked } from '@angular/core';
import { Team } from '../../data-models/team/team';
import { DOCUMENT } from '@angular/common';
import { TeamService } from 'src/app/data-models/team/team.service';

@Component({
  selector: 'team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, AfterViewInit {

  @Input() team = new Team();
  @Input() score = 0;
  @Input() title: string;
  @Input() gameLocked: boolean;
  @Input() spread = null;
  @Output() teamLoaded = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if(this.score == null) {
      this.score = 0;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.teamLoaded.emit(true);
    });
  }

  getGameSpread(number) {
    if(number){
      if(number > 0) {
        return '+' + number;
      } else {
        return number;
      }
    } 
  }
}
