import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatterService {

  constructor() { }

  months = ["January","February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  formatDate(date: Date): string {
      var formattedDate = "";

      formattedDate += this.days[date.getDay()];
      formattedDate += ", " +  this.months[date.getMonth()];
      formattedDate += " " + (date.getDate() + 1);
      if(date.getMinutes() < 10) {
        formattedDate += " at " + date.getHours() + ":" + 0+ date.getMinutes();

      } else {
        formattedDate += " at " + date.getHours() + ":" + date.getMinutes();
      }

      return formattedDate;
  }
}
