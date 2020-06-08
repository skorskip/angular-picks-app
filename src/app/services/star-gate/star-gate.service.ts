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
        var updated = new Date(JSON.parse(localStorage.getItem('picksUpdatedDate')));
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
      if(curr.season != season && curr.week != week) {
        return true;
      }

      //TODO: fix
      return true;
    }
  }

  isItNewWeek(date1: Date, date2: Date) {
    if(Math.ceil((+date2 - +date1) / 86400000) > 7){
      return true;
    } else if(
      (date1.getDay() != date2.getDay()) 
      && (date1 < date2) 
      && (date1.getDay() < 2 && date2.getDay() >= 2)) {
        return true;
    } else {
      return false;
    }
  }

}
