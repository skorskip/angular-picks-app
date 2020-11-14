import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public theme: string;

  constructor() {

  }

  setTheme(theme: string, style: string) {
    var themeObject = {
      'theme' : theme,
      'style' : style
    }
    localStorage.setItem('theme', JSON.stringify(themeObject));
    document.getElementById("theme").setAttribute("href", "assets/themes/" + theme +"/styles-" + theme + ".css");
    if(style == 'dark') {
      document.getElementById("angularTheme").setAttribute("href", "assets/themes/purple-green.css");
    } else {
      document.getElementById("angularTheme").setAttribute("href", "assets/themes/indigo-pink.css");
    }
  }

  getTheme() {
    if(localStorage.getItem('theme') != null) {
      console.log(localStorage.getItem('theme'));
      return JSON.parse(localStorage.getItem('theme'));
    } else {
      return {
        theme : 'light',
        style : 'light'
      };
    }
  }
}
