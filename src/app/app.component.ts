import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ThemeService } from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  loggedIn = false;
  registerSelected = false;
  

  constructor(
    private themeService: ThemeService
  ){}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.themeService.setTheme(this.themeService.getTheme());
  }
}