import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User } from 'src/app/data-models/user/user';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  user = new User();
  editSelected = false;
  theme;

  constructor(
    private authService: AuthenticationService,
    private themeService: ThemeService
  ) { 
    this.theme = this.themeService.getTheme();
  }

  ngOnInit() {

    this.user = this.authService.currentUserValue;
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

}
