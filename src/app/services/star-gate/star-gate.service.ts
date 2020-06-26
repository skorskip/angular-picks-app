import { Injectable } from '@angular/core';
import { StringDecoder } from 'string_decoder';

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
      case "standings":
        return this.standingsAllow(service);
      case "userStandings":
        return this.standingsAllow(service);
      default:
        return true;
    }
  }

  allowWeek(service: string, season: number, week: number): boolean {
    switch(service) {
      case "picks":
        return this.picksAllow(service, season, week);
      case "picksByGame":
        return this.picksByGameAllow(service, season, week);
      case "week":
        return this.weekAllow(service, season, week);
      default :
        return true;
    }
  }

  settingsAllow(key: string): boolean {
    if(localStorage.getItem(key) == null) {
      return true;
    } else {
      var settings = JSON.parse(localStorage.getItem(key));
      var setDate = new Date(settings.date);
      return this.isItNewWeek(setDate, new Date());
    }
  }

  announcementsAllow(key: string): boolean {
    if(localStorage.getItem(key) == null) {
      return true;
    } else {
      var announcements = JSON.parse(localStorage.getItem(key));
      var setDate = new Date(announcements.date);
      return (setDate.getDay() != new Date().getDay()) && (setDate < new Date());
    }
  }

  currentWeekAllow(key: string): boolean {
    if(localStorage.getItem(key) == null) {
      return true;
    } else {
      var curr = JSON.parse(localStorage.getItem(key));
      var setDate = new Date(curr.date);
      return this.isItNewWeek(setDate, new Date());
    }
  }

  standingsAllow(key: string): boolean {
    if(localStorage.getItem(key) == null) {
      return true;
    } else {
      var standing = JSON.parse(localStorage.getItem(key));
      var setDate = new Date(standing.date);
      return this.isItNewWeek(setDate, new Date());
    }
  }

  picksAllow(key: string, season: number, week: number): boolean {
    if(localStorage.getItem(key) == null) {
      return true;
    } else {
      var curr = JSON.parse(localStorage.getItem("currentWeek"));
      if(curr.season != season && curr.week != week) {
        return true;
      } else {
        var updated = new Date(localStorage.getItem('picksUpdatedDate'));
        var picks = JSON.parse(localStorage.getItem(key));
        var setDate = new Date(picks.date);
        return updated > setDate;
      }
    }
  }

  picksByGameAllow(key: string, season: number, week: number) {
    if(localStorage.getItem(key) == null) {
      return true;
    } else {
      var curr = JSON.parse(localStorage.getItem("currentWeek"));
      var picks = JSON.parse(localStorage.getItem(key));
      if(curr.season != season && curr.week != week) {
        return true;
      }
      return this.checkFifteenthMin(new Date(picks.date), new Date());
    }
  }

  weekAllow(key: string, season: number, week: number) {
    if(localStorage.getItem(key) == null) {
      return true;
    } else {
      var curr = JSON.parse(localStorage.getItem(key));
      if(curr.season != season && curr.number != week) {
        return true;
      } else {
        var updated = new Date(localStorage.getItem('picksUpdatedDate'));
        var picks = JSON.parse(localStorage.getItem(key));
        var setDate = new Date(picks.date);
        if(updated > setDate) {
          return true;
        } else {
          return this.checkFifteenthMin(new Date(curr.date), new Date());
        }
      }
    }
  }

  checkFifteenthMin(date1: Date, date2: Date) {
    if(date1.getDate() < date2.getDate()) {
      return true;
    } else if(date1.getHours() < date2.getHours()) {
      return true;
    } else {
      var minutesFromLast = date1.getMinutes() % 15;
      var lastFifteenth = new Date();
      lastFifteenth.setMinutes(date1.getMinutes() - minutesFromLast);
      return (Math.ceil((+date2 - +lastFifteenth) / 60000 ) > 15);
    }
  }

  isItNewWeek(date1: Date, date2: Date) {
    var dayFromStart = date1.getDay() - 2;
    var weekStart = new Date();
    if(dayFromStart > 0) {
      weekStart.setDate(date1.getDate() - dayFromStart);
    } else {
      weekStart.setDate(date1.getDate() - (date1.getDay() + 5));
    }

    if(Math.ceil((+date2 - +date1) / 86400000) > 7){
      return true;
    } else if(
      (date1.getDay() != date2.getDay()) 
      && (date1 < date2) 
      && (Math.ceil((+date2 - +weekStart) / 86400000) >= 7)) {
        return true;
    } else {
      return false;
    }
  }

}
