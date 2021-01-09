import { Component, OnInit, Input, Output, AfterViewInit, EventEmitter, SimpleChange } from '@angular/core';
import { Team } from '../../data-models/team/team';

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
  @Input() fill = false;

  tabable = 1;

  constructor() { }

  ngOnInit() {
    if(this.score == null) {
      this.score = 0;
    }
  }

  ngOnChanges(changes: SimpleChange) {
    if(changes["gameLocked"]?.currentValue) {
      this.tabable = !this.gameLocked ? 1 : -1;
    }
  }

  ngAfterViewInit() {
    if(this.fill) {
      var info = document.getElementById(this.team.team_id + "-team-info");
      var team = document.getElementById(this.team.team_id + "-team-card");
      info.classList.remove(this.team.display_color);
      info.classList.add("base");
      info.classList.add("team-info-result");
      team.classList.remove("quaternary-background");
      team.classList.add(this.team.display_color + "-background");
    }
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
