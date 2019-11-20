import { Component, OnInit, Input, Inject, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { Team } from '../../data-models/team/team';
import { DOCUMENT } from '@angular/common';
import { timeout } from 'rxjs/operators';

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
  @Output() teamLoaded = new EventEmitter();

  constructor(@Inject(DOCUMENT) document) { }

  ngOnInit() {
    if(this.score == null) {
      this.score = 0;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.teamLoaded.emit(true));
  }

  getBorderColor(id:number) {
    var shadowColor = this.team.primary_color.substring(0, this.team.primary_color.lastIndexOf("1")) + ".7)"
    return {
      'color' : this.team.primary_color,
    }
  }

  getTeamName() {
    if(document.getElementById("body").scrollWidth > 950){
      return this.team.abbreviation + " - " + this.team.team_name;
    } else {
      return this.team.abbreviation;
    }
  }

}
