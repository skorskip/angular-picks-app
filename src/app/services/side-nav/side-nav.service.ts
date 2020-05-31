import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {

  isSidebarVisible = false;
  isProfileVisible = false;

  sidebarVisibilityChange: Subject<boolean> = new Subject<boolean>();
  profileVisibilityChange: Subject<boolean> = new Subject<boolean>();

  constructor()  {
      this.sidebarVisibilityChange.subscribe((value) => {
          this.isSidebarVisible = value
      });

      this.profileVisibilityChange.subscribe((value) => {
        this.isProfileVisible = value
    });
  }

  toggleSidebarVisibility() {
    
      this.sidebarVisibilityChange.next(!this.isSidebarVisible);
  }

  toggleProfileVisibility() {
    this.profileVisibilityChange.next(!this.isProfileVisible);
  }
}
