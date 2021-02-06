import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ThemeService } from './services/theme/theme.service';
import { Auth } from 'aws-amplify';
import { AuthenticationService } from './services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  loggedIn = false;
  registerSelected = false;
  

  constructor(
    private themeService: ThemeService,
    private authService: AuthenticationService
  ){}

  ngOnInit() {
    Auth.currentSession().then((data) => {
      var expiration = new Date(data.getIdToken().getExpiration() * 1000);
      if(new Date() > expiration){
        this.authService.logout();
      } else {
        var token = data.getIdToken().getJwtToken();
        localStorage.setItem("token", token);
      }
    }).catch(err => console.log("AMPLIFY ERROR::" + err))
  }

  ngAfterViewInit() {
    this.themeService.setTheme(this.themeService.getTheme());
  }
}