import { Injectable } from '@angular/core';
import { Week } from './week';

@Injectable({ providedIn: 'root' })
export class WeekService {
    private weekUrl = 'api/week';
    private weeks:Week[] = [
        {
            'id':100,
            'number': 6,
            'games' : [101, 102, 103],
            'teams' : [101, 102, 103, 104, 105, 106],
            'date' : 'SUN, OCT 8, 2018'
        }
    ]
    private week;

    constructor(){}
    
    getWeek(id:number): Week {
        this.weeks.forEach((weekItem) => {
          if(weekItem.id === id){
            this.week = weekItem;
          }
        });
        return this.week;
    }
}