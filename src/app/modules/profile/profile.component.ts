import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User } from 'src/app/data-models/user/user';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { UserService } from 'src/app/data-models/user/user.service';
import { UserStanding } from 'src/app/data-models/user/user-standing';
import { WeekService } from 'src/app/data-models/week/week.service';
import { LeagueService } from 'src/app/data-models/league/league.service';
import { League } from 'src/app/data-models/league/league';
import { PickService } from 'src/app/data-models/pick/pick.service';
import { Pick } from 'src/app/data-models/pick/pick';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  user = new User();
  editSelected = false;
  userStandings = new UserStanding();
  settings = new League();
  picks = [] as Pick[];
  pickProgress = 0;
  theme;

  constructor(
    private authService: AuthenticationService,
    private picksService: PickService,
    private userService: UserService,
    private weekService: WeekService,
    private themeService: ThemeService,
    private leagueService: LeagueService
  ) { 
    this.theme = this.themeService.getTheme();
  }

  ngOnInit() {
    this.user = this.authService.currentUserValue;

    this.leagueService.getLeagueSettings().subscribe((settings)=>{
      this.settings = settings;
    });

    this.weekService.getCurrentWeek().subscribe((week) => {
      this.userService.getStandingsByUser(week.season, this.user).subscribe((results) => {
        this.userStandings = results[0];
        this.pickProgress = ((this.userStandings.picks + this.picks.length)/ this.settings.maxTotalPicks) * 100;
      });

      this.picksService.getPicksByWeek(this.user, week.season, week.week).subscribe((picks) => {
        this.picks = picks.picks;
      });
    });
  }

  ngAfterViewInit() {
    this.toggleTheme(this.theme);
  }

  editUser() {
    this.editSelected = true;
  }

  updated() {
    this.editSelected = false;
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }

  toggleTheme(theme: string) {
    this.theme = theme;
    this.themeService.setTheme(theme);
  }

  setPickProgress(pickTotal){
    this.pickProgress = (pickTotal + this.picks.length)/ this.settings.maxTotalPicks * 100;
  }

}
