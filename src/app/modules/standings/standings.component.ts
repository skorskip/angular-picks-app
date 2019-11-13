import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/data-models/user/user.service';
import { UserStanding } from 'src/app/data-models/user/user-standing';
import { User } from 'src/app/data-models/user/user';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit {
  displayedColumns: string[] = ['user_inits', 'wins', 'picks', 'win_pct'];
  dataSource = [] as UserStanding[];
  currentUser = new User();
  constructor(
    private userService: UserService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.userService.getStandings(2019).subscribe((users) => {
      this.dataSource = users;
    });

    this.currentUser = this.authService.currentUserValue;

  }

  test(row) {
    console.log(row);
  }



}
