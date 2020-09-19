import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { PickService } from 'src/app/data-models/pick/pick.service';
import { UserService } from 'src/app/data-models/user/user.service';
import { WeekService } from 'src/app/data-models/week/week.service';
import { LeagueService } from 'src/app/data-models/league/league.service';
import { User } from 'src/app/data-models/user/user';
import { League } from 'src/app/data-models/league/league';
import { UserStanding } from 'src/app/data-models/user/user-standing';
import { Pick } from 'src/app/data-models/pick/pick';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss']
})
export class UserStatsComponent implements OnInit {

  user = new User();
  settings = new League();
  picks = [] as Pick[];
  userStandings = new UserStanding();
  pickProgress = 0;

  constructor(
    private authService: AuthenticationService,
    private picksService: PickService,
    private userService: UserService,
    private weekService: WeekService,
    private leagueService: LeagueService
  ) { }

  ngOnInit(): void {
    this.setUserData(this.authService.currentUserValue);
  }

  setUserData(user: User) {
    this.user = user;

    this.leagueService.getLeagueSettings().subscribe((settings)=>{
      this.settings = settings;
    });

    this.weekService.getCurrentWeek().subscribe((week) => {
      this.picksService.getPicksByWeek(this.user, week.season, week.seasonType, week.week).subscribe((picks) => {
        this.picks = picks.picks;

        this.userService.getStandingsByUser(week.season, week.seasonType, week.week, this.user).subscribe((results) => {
          this.userStandings = results[0];
          this.pickProgress = ((this.userStandings.picks + this.userStandings.pending_picks)/ this.settings.maxTotalPicks) * 100;
        });
      });
    });
  }
}
