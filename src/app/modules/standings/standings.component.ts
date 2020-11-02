import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/data-models/user/user.service';
import { UserStanding } from 'src/app/data-models/user/user-standing';
import { User } from 'src/app/data-models/user/user';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { WeekService } from 'src/app/data-models/week/week.service';
import { CurrentWeek } from 'src/app/data-models/week/current-week';

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

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private weekService: WeekService
  ) { }

  ngOnInit() {
    this.weekService.getCurrentWeek().subscribe( week => {
      this.week = week;
      this.userService.getStandings(week.season, week.seasonType).subscribe((users: UserStanding[]) => {
        this.standings= users;
      });
    });

    this.currentUser = this.authService.currentUserValue;
  }

  getPeekUserPicks(row: UserStanding) {
    this.showPeekUser = true;
    this.peekUser = row;
  }

  getUserPicks(row: UserStanding) {
    this.otherUser = row;
  }

  hidePeekUserPicks(event: boolean) {
    this.showPeekUser = false;
  }

  back() {
    this.showUserPicks = false;
  }
}
