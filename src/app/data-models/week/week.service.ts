import { Injectable } from '@angular/core';
import { Week } from './week';

@Injectable({ providedIn: 'root' })
export class WeekService {
    private weekUrl = 'api/week';
    private weeks:Week[] = [
        {
            'id':106,
            'number': 6,
            'games' : [101, 102, 103, 104, 105, 106, 107, 108, 109],
            'teams' : [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
            'date' : 'SUN, OCT 8, 2018'
        },
        {
            'id':105,
            'number': 5,
            'games' : [101, 102, 103, 104, 105, 106, 107, 108, 109],
            'teams' : [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
            'date' : 'SUN, OCT 8, 2018'
        },
        {
            'id':104,
            'number': 4,
            'games' : [101, 102, 103, 104, 105, 106, 107, 108, 109],
            'teams' : [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
            'date' : 'SUN, OCT 8, 2018'
        },
        {
            'id':103,
            'number': 3,
            'games' : [101, 102, 103, 104, 105, 106, 107, 108, 109],
            'teams' : [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
            'date' : 'SUN, OCT 8, 2018'
        },
        {
            'id':102,
            'number': 2,
            'games' : [101, 102, 103, 104, 105, 106, 107, 108, 109],
            'teams' : [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
            'date' : 'SUN, OCT 8, 2018'
        },
        {
            'id':101,
            'number': 1,
            'games' : [101, 102, 103, 104, 105, 106, 107, 108, 109],
            'teams' : [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
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

    getWeeks(): Week[] {
        return this.weeks;
    }

    getCurrentWeek(): Week {
        var maxValue = 0;
        var maxIndex:number = 0;
        this.weeks.forEach((weekItem, i) => {
            if(weekItem.number > maxValue){
                maxValue = weekItem.number;
                maxIndex = weekItem.id;
            }
        });
        return this.getWeek(maxIndex);
    }
}