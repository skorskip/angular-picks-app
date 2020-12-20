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
  @Input() size = null;
  @Input() highlight = false;
  @Input() status = null;
  @Input() selectable = true;
  @Output() teamLoaded = new EventEmitter();

  tabable = 1;

  constructor() { }

  ngOnInit() {
    if(this.score == null) {
      this.score = 0;
    }
    this.tabable = this.selectable ? 1 : -1;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.teamLoaded.emit(this.team);
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
