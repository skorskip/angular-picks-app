import { Component, OnInit, Input } from '@angular/core';
import { WeekService } from '../../data-models/week/week.service';
import { WeeksService } from './weeks.service';
import { Week } from '../../data-models/week/week';
import { Router } from '@angular/router';

@Component({
  selector: 'weeks',
  templateUrl: './weeks.component.html',
  styleUrls: ['./weeks.component.css']
})
export class WeeksComponent implements OnInit {
  @Input() title;
  @Input() number;
  weeksView = false;

  weeks: any = [];
  constructor(
    private weekService: WeekService, 
    private weeksService: WeeksService,
    private router:Router) { }

  ngOnInit() {}

  showWeeks() {
    this.weekService.getCurrentWeek().subscribe( currentWeek => {
      for(var i = 1; i <= currentWeek.number; i++) {
        var week = {} as any;
        week.number = i;
        this.weeks.push(week);
      }
      var element = document.getElementById("week-card");
      element.className = "week-out-animation";
      setTimeout(()=>{
        this.weeksView = true; 
      },500);
    });
  }

  weekSelected(weekSelected:Week) {
    this.weeksService.weekSelected(weekSelected);
    var element = document.getElementById("weeks-container");
    element.className = "week-out-animation";
    this.weeksView = false; 
  }
}
