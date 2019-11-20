import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatterService {

  constructor() { }

  months = ["Jan","Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

  formatDate(date: Date): string {
      var formattedDate = "";

      formattedDate += this.days[date.getDay()];
      formattedDate += ", " +  this.months[date.getMonth()];
      formattedDate += " " + (date.getDate());
      if(date.getMinutes() < 10) {
        formattedDate += " at " + date.getHours() + ":" + 0+ date.getMinutes();

      } else {
        formattedDate += " at " + date.getHours() + ":" + date.getMinutes();
      }

      return formattedDate;
  }
}
