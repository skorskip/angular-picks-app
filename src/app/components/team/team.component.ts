import { Component, OnInit, Input, Inject, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { Team } from '../../data-models/team/team';
import { DOCUMENT } from '@angular/common';

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
    this.teamLoaded.emit(true);
  }

  getBorderColor(id:number) {
    var shadowColor = this.team.primaryColor.substring(0, this.team.primaryColor.lastIndexOf("1")) + ".7)"
    return {
      'color' : this.team.primaryColor,
    }
  }

  getTeamName() {
    if(document.getElementById("body").scrollWidth > 950){
      return this.team.name;
    } else {
      return this.team.abbreviation;
    }
  }

}
