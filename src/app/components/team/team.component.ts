import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { Team } from '../../data-models/team/team';

@Component({
  selector: 'team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

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

  getTeamInfoClass() {
    var classList = 'team-info disabled ';
    classList += this.highlight ? 'highlight-team ' : '';
    classList += this.fill ? 'base team-info-result ' : this.team.display_color;
    return classList;
  }

  getTeamCardClass() {
    var classList = ""
    classList += this.size == 'medium' ? 'team-card-medium ' : 'team-card ';
    classList += this.fill ? this.team.display_color + '-background' : 'quaternary-background';
    return classList;
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
