import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  ){}

  ngOnInit() {}

  login(event: any) {
    this.loggedIn = event;
    if(this.loggedIn) {
      this.router.navigate(['/weeklyGames']);
    }
  }

  register(event: any) {
    this.registerSelected = event;
  }
}
