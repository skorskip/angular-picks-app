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
  themeList = [
    {
      name : "Banana Split",
      value : "banana-split",
      style : "dark"
    },
    {
      name : "Giants",
      value : "giants",
      style : "dark"
    }, 
    {
      name : "Broncos",
      value : "broncos",
      style : "dark"
    }, 
    {
      name : "Green Bay",
      value : "green-bay",
      style : "dark"
    }, 
    {
      name : "Vikings",
      value : "vikings",
      style : "dark"
    },
    {
      name : "Saints",
      value : "saints",
      style : "dark"
    },
    {
      name : "Jets",
      value : "jets",
      style : "light"
    },
    {
      name : "Lions",
      value : "lions",
      style : "light"
    }, 
    {
      name : "49ers",
      value : "49er",
      style : "dark"
    },
    {
      name : "Football Team",
      value : "football-team",
      style : "dark"
    },
    {
      name : "Cowboys",
      value : "cowboys",
      style : "light"
    },
    {
      name : "Seahawks",
      value : "seahawks",
      style : "dark"
    }
  ]

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
    this.setUserData(this.authService.currentUserValue);
  }

  ngAfterViewInit() {
    this.toggleTheme(this.theme.theme, this.theme.style);
  }

  setUserData(user: User) {
    this.user = user;

    this.leagueService.getLeagueSettings().subscribe((settings)=>{
      this.settings = settings;
    });

    this.weekService.getCurrentWeek().subscribe((week) => {
      this.picksService.getPicksByWeek(this.user, week.season, week.seasonType, week.week).subscribe((picks) => {
        if(picks != null) {
          this.picks = picks.picks;
        }

        this.userService.getStandingsByUser(week.season, week.seasonType, week.week, this.user).subscribe((results) => {
          if(results != null){
            this.userStandings = results[0];
            this.pickProgress = ((this.userStandings.picks + this.picks.length)/ this.settings.maxTotalPicks) * 100;
          }
        });
      });
    });
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

  toggleTheme(theme: string, style: string) {
    this.theme = theme;
    this.themeService.setTheme(theme,style);
  }

  setPickProgress(pickTotal){
    this.pickProgress = (pickTotal + this.picks.length)/ this.settings.maxTotalPicks * 100;
  }

}
