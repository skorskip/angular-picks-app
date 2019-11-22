import { Component, OnInit, Input, Inject, Output, AfterViewInit, EventEmitter, AfterViewChecked } from '@angular/core';
import { Team } from '../../data-models/team/team';
import { DOCUMENT } from '@angular/common';
import { timeout } from 'rxjs/operators';
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
  @Output() teamLoaded = new EventEmitter();

  constructor(
    @Inject(DOCUMENT) document,
    private teamService: TeamService) { }

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

  getBorderColor(team: Team) {
    return {
      'color' : team.primary_color,
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
