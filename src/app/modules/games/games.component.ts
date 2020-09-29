import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { slideLeftAnimation, slideRightAnimation } from 'src/app/animations/app-routing-animation';
import { WeeksService } from 'src/app/components/weeks/weeks.service';
import { CurrentWeek } from 'src/app/data-models/week/current-week';
import { WeekService } from 'src/app/data-models/week/week.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
  animations: [slideRightAnimation, slideLeftAnimation]
})
export class GamesComponent implements OnInit {

  season = 0;
  week = 0;
  seasonType = 0;
  currentWeek = new CurrentWeek();
  toggleType = "games";
  subtitle = "";
  displayEditButton = false;
  editPicks = false;
  submitEdits = false;
  view = "games";
  title = "Games";
  subscription: Subscription;

  @Input() otherUsers = null;

  constructor(
    private route:ActivatedRoute,
    private weekService: WeekService,
    private weeksService: WeeksService,
  ) { 
    this.subscription = this.weeksService.weekSelected$.subscribe(
      week => {
        this.season = week.season;
        this.seasonType = week.seasonType;
        this.week = week.week;
      }
    );
  }

  ngOnInit(): void {
    var seasonParam = +this.route.snapshot.paramMap.get('season') as number;
    var seasonTypeParam = +this.route.snapshot.paramMap.get('seasonType') as number;
    var weekParam = +this.route.snapshot.paramMap.get('week') as number;

    this.weekService.getCurrentWeek().subscribe(currentWeek => {
      this.currentWeek = currentWeek;

      if(seasonParam == 0 || weekParam == 0 || seasonTypeParam == 0) {
        this.season = this.currentWeek.season;
        this.seasonType = this.currentWeek.seasonType;
        this.week = this.currentWeek.week;
      } else {
        this.season = seasonParam;
        this.seasonType = seasonTypeParam;
        this.week = weekParam;
      }
    });

    if(this.otherUsers != null) {
      this.toggleType = 'none';
    }
  }

  setSubtitle(event: string) {
    this.subtitle = event;
  }

  setView(event: string) {
    this.view = event;
    this.toggleType = event;
    if(this.view == "picks") {
      this.title = "Picks";
    } else {
      this.title = "Games";
    }
  }

  setEditPicks(event: boolean) {
    console.log("SET EDIT PICKS::", event);
    this.editPicks = event;
    if(event) {
      this.submitEdits = false;
    }
  }

  setSubmitEdits(event: boolean) {
    this.submitEdits = event;
    if(event) {
      this.editPicks = false;
    }
  }

  isPicks(): boolean {
    return this.view === 'picks';
  }

  isGames(): boolean {
    return this.view === 'games';
  }

  showEditButton(): boolean {
    return this.view == 'picks' && this.displayEditButton;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
