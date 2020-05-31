import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StarGateService {

  constructor(
  ) { }

  allow(service: string): boolean {
    switch(service) {
      case "settings":
        return this.settingsAllow(service);
      case "announcements":
        return this.announcementsAllow(service);
      case "currentWeek":
        return this.currentWeekAllow(service);
    }
  }

  settingsAllow(key: string): boolean {
    if(localStorage.getItem(key) == null) {
      return true;
    } else {
      var settings = JSON.parse(localStorage.getItem(key));
      var curr = JSON.parse(localStorage.getItem(key));
      return (curr.week > settings.seasonEndWeek);
    }
  }

  announcementsAllow(key: string): boolean {
    if(localStorage.getItem(key) == null) {
      return true;
    } else {
      var announcements = JSON.parse(localStorage.getItem(key));
      var setDate = new Date(announcements.date);
      return setDate.getDate() < new Date().getDate();
    }
  }

  currentWeekAllow(key: string): boolean {
    if(localStorage.getItem(key) == null) {
      return true;
    } else {
      var curr = JSON.parse(localStorage.getItem(key));
      var setDate = new Date(curr.date);
      return true;
    }
  }

}
