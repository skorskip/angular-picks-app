import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
import { Week } from '../../data-models/week/week';
import { CurrentWeek } from 'src/app/data-models/week/current-week';

@Injectable({
  providedIn: 'root'
})
export class WeeksService {

   private weekSource = new Subject<CurrentWeek>();
  
   weekSelected$ = this.weekSource.asObservable();
  
   weekSelected(season: number, seasonType: number, week: number) {
     let weekSeason = new CurrentWeek();
     weekSeason.season = season;
     weekSeason.seasonType = seasonType;
     weekSeason.week = week;
     this.weekSource.next(weekSeason);
   }
}
