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
  @Input() view;
  @Input() season =0;
  weeksView = false;
  weeks = [] as number[];

  constructor(
    private weekService: WeekService, 
    private weeksService: WeeksService,
    private router:Router) { }

  ngOnInit() {}

  showWeeks() {
    var tempWeeks = [];
    this.weekService.getCurrentWeek().subscribe( currentWeek => {
      this.season = currentWeek.season;
      for(var i = 1; i <= currentWeek.number; i++) {
        var week = {} as any;
        week.number = i;
        tempWeeks.push(week);
      }
      this.weeks = tempWeeks.reverse();
      var element = document.getElementById("week-card");
      element.className = "week-out-animation";

      setTimeout(()=>{
        this.weeksView = true; 
      },500);
    });
  }

  weekSelected(weekSelected:number) {
    this.weekService.getWeek(this.season, weekSelected).subscribe( week => {
      this.weeksService.weekSelected(week);
      var element = document.getElementById("weeks-container");
      element.className = "week-out-animation";
      this.weeksView = false;
    });
  }

  toggleView(view) {
    if(view == "picks") {
      this.router.navigate(['/myPicks/' + this.season + '/' + this.number]);
    } else {
      this.router.navigate(['/weeklyGames/' + this.season + '/' + this.number]);
    }
  }
}
