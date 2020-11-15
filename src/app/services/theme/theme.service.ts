import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public theme: string;

  public themeList = [
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
  ];

  constructor() {}

  setTheme(theme: string) {
    localStorage.setItem('theme', theme);
    document.getElementById("theme").setAttribute("href", "assets/themes/" + theme +"/styles-" + theme + ".css");
    this.setThemeStyle(theme);
  }

  getThemeList() {
    return this.themeList;
  }

  setThemeStyle(theme: string) {
    if(theme == 'dark' || theme == 'light') {
      if(theme == 'dark') {
        document.getElementById("angularTheme").setAttribute("href", "assets/themes/purple-green.css");
      } else {
        document.getElementById("angularTheme").setAttribute("href", "assets/themes/indigo-pink.css");
      }
    } else {
      this.themeList.forEach(themeItem => {
        if(theme === themeItem.value) {
          if(themeItem.style == 'dark') {
            document.getElementById("angularTheme").setAttribute("href", "assets/themes/purple-green.css");
          } else {
            document.getElementById("angularTheme").setAttribute("href", "assets/themes/indigo-pink.css");
          }
        }
      });
    }
  }

  getTheme(): string {
    if(localStorage.getItem('theme') != null) {
      return localStorage.getItem('theme');
    } else {
      return 'light';
    }
  }
}
