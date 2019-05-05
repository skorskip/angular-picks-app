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

  weeks: Week[] = [];
  constructor(
    private weekService: WeekService, 
    private weeksService: WeeksService,
    private router:Router) { }

  ngOnInit() {}

  showWeeks() {
    this.weeks = this.weekService.getWeeks();
    var element = document.getElementById("week-card");
    element.className = "week-out-animation";
    setTimeout(()=>{
      this.weeksView = true; 
    },500);
  }

  weekSelected(weekSelected:Week) {
    this.weeksService.weekSelected(weekSelected.id)
    var element = document.getElementById("weeks-container");
    element.className = "week-out-animation";
    this.weeksView = false; 
  }
}
