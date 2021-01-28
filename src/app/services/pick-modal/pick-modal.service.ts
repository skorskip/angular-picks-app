import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PickModalService {

  pickModalData = null;

  pickModalVisibilityChange: Subject<any> = new Subject<any>();

  constructor()  {
    this.pickModalVisibilityChange.subscribe((value) => {
        this.pickModalData = value
    });
  }

  togglePickModalVisibility() {
    if(this.pickModalData != null) {
      this.pickModalVisibilityChange.next(null);
    } else {
      this.pickModalVisibilityChange.next(this.pickModalData);
    }
  }
  
  setPickModalVisibility(visibility) {
    this.pickModalVisibilityChange.next(visibility);
  }
}
