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
    document.getElementById("theme").setAttribute("href", "assets/themes/" + theme +"/styles-" + theme + ".css");
  }

  getTheme() {
    if(localStorage.getItem('theme') != null) {
      return localStorage.getItem('theme');
    } else {
      return 'light';
    }
  }
}
