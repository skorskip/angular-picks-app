import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './data-models/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loggedIn = false;
  registerSelected = false;

  constructor(
    private router:Router,
    private userService: UserService
  ){}

  ngOnInit() {
    this.router.navigate(['/weeklyGames']);
  }
}