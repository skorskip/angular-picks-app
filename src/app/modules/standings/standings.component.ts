import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/data-models/user/user.service';
import { UserStanding } from 'src/app/data-models/user/user-standing';
import { User } from 'src/app/data-models/user/user';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { WeekService } from 'src/app/data-models/week/week.service';
import { CurrentWeek } from 'src/app/data-models/week/current-week';
import { Subscription } from 'rxjs';
import { WeeksService } from 'src/app/components/weeks/weeks.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit {
  displayedColumns: string[] = ['ranking', 'user_inits', 'wins', 'picks', 'win_pct', 'arrow'];
  standings = [] as UserStanding[];
  currentUser = new User();
  showUserPicks = false;
  otherUser = new UserStanding();
  peekUser = new UserStanding();
  showPeekUser = false;
  week = new CurrentWeek();
  subscription: Subscription;
  loader = true;

  constructor(
    private router: Router,
    private route:ActivatedRoute,
    private userService: UserService,
    private authService: AuthenticationService,
    private weekService: WeekService,
    private weeksService: WeeksService
  ) { 
    this.subscription = this.weeksService.weekSelected$.subscribe(
      week => {
        this.week = week;
      }
    );
  }

  ngOnInit() {
    var userParam = +this.route.snapshot.paramMap.get('userId') as number;
    this.weekService.getCurrentWeek().subscribe( week => {
      this.week = week;
      this.userService.getStandings(week.season, week.seasonType).subscribe((users: UserStanding[]) => {
        this.standings= users;
        this.loader = false;
        this.showUserPicksFromParam(userParam);
      });
    });

    this.currentUser = this.authService.currentUserValue;
  }

  showUserPicksFromParam(userId){
    if(userId != null) {
      this.standings.forEach(standing => {
        if(standing.user_id === userId) {
          this.getUserPicks(standing);
        }
      });
    }
  }

  getPeekUserPicks(row: UserStanding) {
    this.showPeekUser = true;
    this.peekUser = row;
  }

  getUserPicks(row: UserStanding) {
    this.showUserPicks = true;
    this.otherUser = row;
  }

  hidePeekUserPicks(event: boolean) {
    this.showPeekUser = false;
  }

  back() {
    this.showUserPicks = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
