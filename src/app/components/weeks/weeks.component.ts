import { Component, OnInit } from '@angular/core';
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

  weeks: Week[] = [];
  constructor(
    private weekService: WeekService, 
    private weeksService: WeeksService,
    private router:Router) { }

  ngOnInit() {
    this.showWeeks();
  }

  showWeeks() {
    this.weeks = this.weekService.getWeeks();
  }

  weekSelected(weekSelected:Week) {
    this.weeksService.weekSelected(weekSelected.id)
    var element = document.getElementById("weeks-container");
    element.className = "week-out-animation";
  }

}
