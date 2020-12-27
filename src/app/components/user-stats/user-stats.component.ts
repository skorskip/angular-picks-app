import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService } from 'src/app/data-models/user/user.service';
import { WeekService } from 'src/app/data-models/week/week.service';
import { User } from 'src/app/data-models/user/user';
import { UserStanding } from 'src/app/data-models/user/user-standing';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss']
})
export class UserStatsComponent implements OnInit {

  user = new User();
  userStandings = new UserStanding();
  pickProgressBar = 0;
  pickProgress = 0;
  maxTotalPicks = 0;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private weekService: WeekService) { }

  ngOnInit(): void {
    this.setUserData(this.authService.currentUserValue);
  }

  setUserData(user: User) {
    this.user = user;

    this.weekService.getCurrentWeek().subscribe((week) => {

      this.userService.getUserPickLimit(week.season, 
        week.seasonType, 
        this.authService.currentUserValue.user_id).subscribe((limit) => {
          this.maxTotalPicks = limit.max_picks;
      });

      this.userService.getStandingsByUser(week.season, week.seasonType, week.week, this.user).subscribe((results) => {
        if(results != null){
          this.userStandings = results[0];
          this.pickProgress = this.userStandings.picks + this.userStandings.pending_picks;
          this.pickProgressBar = ((this.userStandings.picks + this.userStandings.pending_picks)/ this.maxTotalPicks) * 100;
        }
      });
    });
  }
}
