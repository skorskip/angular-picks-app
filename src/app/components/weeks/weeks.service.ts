import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeeksService {

   private weekSource = new Subject<number>();
  
   weekSelected$ = this.weekSource.asObservable();
  
   weekSelected(weekId: number) {
     this.weekSource.next(weekId);
   }
}
