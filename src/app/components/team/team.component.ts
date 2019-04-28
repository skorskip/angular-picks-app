import { Component, OnInit, Input, Inject } from '@angular/core';
import { Team } from '../../data-models/team/team';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  @Input() team: Team;
  @Input() score: any;
  @Input() title: string;
  @Input() progress: string;

  constructor(@Inject(DOCUMENT) document) { }

  ngOnInit() {
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
      return this.team.abbrevation;
    }
    
  }

}
