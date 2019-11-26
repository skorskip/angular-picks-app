import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public theme: string;

  constructor() {

  }

  setTheme(theme: string) {
    localStorage.setItem('theme', theme);

    if(theme == 'dark') {
      document.getElementById("theme").setAttribute("href", "assets/themes/styles-dark.css");
      document.getElementById("angularTheme").setAttribute("href", "assets/themes/purple-green.css");
    } else {
      document.getElementById("theme").setAttribute("href","assets/themes/styles-light.css");
      document.getElementById("angularTheme").setAttribute("href", "assets/themes/indigo-pink.css");
    }
  }

  getTheme() {
    if(localStorage.getItem('theme') != null) {
      return localStorage.getItem('theme');
    } else {
      return 'light';
    }
  }
}
