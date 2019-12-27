import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {

  isSidebarVisible = false;

  sidebarVisibilityChange: Subject<boolean> = new Subject<boolean>();

  constructor()  {
      this.sidebarVisibilityChange.subscribe((value) => {
          this.isSidebarVisible = value
      });
  }

  toggleSidebarVisibility() {
    
      this.sidebarVisibilityChange.next(!this.isSidebarVisible);
  }
}
