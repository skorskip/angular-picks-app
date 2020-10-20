import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { WeekService } from '../../data-models/week/week.service';
import { WeeksService } from './weeks.service';
import { Router } from '@angular/router';
import { CurrentWeek } from 'src/app/data-models/week/current-week';

@Component({
  selector: 'weeks',
  templateUrl: './weeks.component.html',
  styleUrls: ['./weeks.component.css']
})
export class WeeksComponent implements OnInit {
  @Input() number;
  @Input() view = "";
  @Input() season = 0;
  @Input() seasonType = 0;
  @Output() viewType = new EventEmitter();
  weeksView = false;
  weeks = [] as number[];
  hideToggle = false;
  currentWeek = new CurrentWeek();

  constructor(
    private weekService: WeekService, 
    private weeksService: WeeksService,
    private router:Router) { }

  ngOnInit() {
    if(this.view == "none") {
      this.hideToggle = true;
    }
    this.weekService.getCurrentWeek().subscribe( currentWeek => {
      this.currentWeek = currentWeek;
    });
  }

  ngOnChanges(changes: SimpleChange) {
    if(changes["view"]?.currentValue != changes["view"]?.previousValue) {
      this.toggleView(this.view);
    }
  }

  showWeeks() {
    var tempWeeks = [];
    this.seasonType = this.currentWeek.seasonType;
    this.season = this.currentWeek.season;
    for(var i = 1; i <= this.currentWeek.week; i++) {
      var week = {} as any;
      week.number = i;
      tempWeeks.push(week);
    }
    this.weeks = tempWeeks.reverse();
    this.weeksView = true;
  }

  weekNext() {
    this.weekSelected(parseInt(this.number) + 1); 
  }

  weekPrev() {
    this.weekSelected(parseInt(this.number) - 1);
  }

  showWeekPrev() {
    return this.number != 1; 
  }

  showWeekNext() {
    return this.number != this.currentWeek.week;
  }

  weekSelected(weekSelected:number) {
    this.weeksService.weekSelected(this.currentWeek.season, this.currentWeek.seasonType, weekSelected);
    var element = document.getElementById("weeks-container");
    if(element != null) {
      element.className = "week-out-animation";
      this.weeksView = false;
    }
  }

  toggleView(view) {
    this.router.navigate(['/games/' + this.season + '/' + this.seasonType + '/' + this.number]);

    if(view == "picks") {
      this.viewType.emit("picks");
    } else {
      this.viewType.emit("games");
    }
  }
}
