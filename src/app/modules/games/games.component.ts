import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { WeeksService } from 'src/app/components/weeks/weeks.service';
import { PickData } from 'src/app/data-models/pick/pick-data';
import { CurrentWeek } from 'src/app/data-models/week/current-week';
import { WeekService } from 'src/app/data-models/week/week.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  season = 0;
  week = 0;
  seasonType = 0;
  currentWeek = new CurrentWeek();
  toggleType = "games";
  subtitle = "";
  displayEditButton = false;
  navEditClicked = false;
  navSubmitEdit = false;
  view = "games";
  subscription: Subscription;
  picksSubmitted = false;
  toggleButton = 'games';
  submitPicks = false;
  pickSubtitle = "";
  gamesSubtitle = "";
  picksUpdated = false;
  displaySubmitButton = false;
  showPeekUser = false;
  peekUser = new PickData();

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

  subSubtitlePicks(event: string) {
    this.pickSubtitle = event;
    if(this.isPicks()) this.subtitle = this.pickSubtitle;
  }

  subSubtitleGames(event: string) {
    this.gamesSubtitle = event;
    if(this.isGames()) this.subtitle = this.gamesSubtitle;
  }

  setView(event: string) {
    this.view = event;
    this.toggleType = event;
    if(this.view == "picks") {
      this.subtitle = this.pickSubtitle;
      this.picksUpdated = false;
    } else {
      this.subtitle = this.gamesSubtitle;
      this.picksSubmitted = false;
    }
  }

  subNavEditClicked(event: boolean) {    
    this.navEditClicked = event;
    if(event) {
      this.navSubmitEdit = false;
    }
  }

  subNavSubmitEdit(event: boolean) {
    this.navSubmitEdit = event;
    if(event) {
      this.navEditClicked = false;
    }
  }

  subDisplayEditButton(event: boolean) {
    this.displayEditButton = event;
  }

  isPicks(): boolean {
    return this.view === 'picks';
  }

  isGames(): boolean {
    return this.view === 'games';
  }

  displayEditButtonOnView(): boolean {
    return this.view == 'picks' && this.displayEditButton;
  }

  subDisplaySubmitButton(event: boolean) {
    this.displaySubmitButton = event;
  }

  submitPicksClick() {
    this.submitPicks = true;
  }

  subPicksSubmitted(event: boolean) {
    this.subDisplaySubmitButton(false);
    this.submitPicks = false;
    this.picksSubmitted = event;
    this.toggleType = 'picks';
  }

  subPicksUpdated(event: boolean) {
    this.picksUpdated = event;
  }

  subNavPicksUpdated(event: boolean) {
    this.picksUpdated = false;
  }

  peekUserSelected(event){
    this.peekUser = event;
    this.showPeekUser = true;
  }

  hidePeekUserPicks(event) {
    this.showPeekUser = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
