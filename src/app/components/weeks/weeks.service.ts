import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';
import { Week } from '../../data-models/week/week';

@Injectable({
  providedIn: 'root'
})
export class WeeksService {

   private weekSource = new Subject<Week>();
  
   weekSelected$ = this.weekSource.asObservable();
  
   weekSelected(weekSeason: Week) {
     this.weekSource.next(weekSeason);
   }
}
