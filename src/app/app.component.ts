import { Component, OnInit,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { WeekService } from '../app/data-models/week/week.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  events: string[] = [];
  openedSmall: boolean;
  opened:boolean;
  largeScreen: boolean;
  selectedLarge = "weekly-games-large";
  selectedSmall = "weekly-games";

  constructor(@Inject(DOCUMENT) document, private router:Router, private weekService:WeekService){}

  ngOnInit() {
    if(document.getElementById("side-nav").scrollWidth > 950){
      this.largeScreen = true;
      this.openedSmall = false;
    } else {
      this.largeScreen = false;
      this.openedSmall = true;
    }
  }

  ngAfterViewInit() {
    var element;
    if(this.largeScreen){
      element = document.getElementById(this.selectedLarge);
    } else {
      element = document.getElementById(this.selectedSmall);
    }    
    if(element != null){
      element.classList.add("accent-color-primary");
      element.classList.add("selected");
    }
  }

  onResize(event) {
    if(event.target.innerWidth > 950){
      this.largeScreen = true;
      this.openedSmall = false;
      this.highlight(this.selectedLarge);
    } else {
      this.opened = false;
      this.largeScreen = false;
      this.openedSmall = true;
      this.highlight(this.selectedSmall);
    }
  }

  highlight(id:string) {
    document.getElementById(id).classList.add("accent-color-primary");
    document.getElementById(id).classList.add("selected");
    if(id != this.selectedLarge && this.largeScreen){
      document.getElementById(this.selectedLarge).classList.remove("accent-color-primary");
      document.getElementById(this.selectedLarge).classList.remove("selected");
      this.selectedLarge = id;
    } else if(id != this.selectedSmall && !this.largeScreen){
      document.getElementById(this.selectedSmall).classList.remove("accent-color-primary");
      document.getElementById(this.selectedSmall).classList.remove("selected");
      this.selectedSmall = id;
    }
  }

  navigateToPage(link:string){
    this.router.navigate(['/'+link]);
  }

  navigateToMyPicks() {
    var week = this.weekService.getCurrentWeek();
    this.router.navigate(['/myPicks/' + week.id]);
  }

  mouseover(event:any){
    var element  = document.getElementById(event.path[2].id);
    if(element != null){
      element.classList.add("accent-color-primary");
    }
  }

  mouseout(event:any){
    var element  = document.getElementById(event.path[2].id);
    if(element != null){
      if(!element.classList.contains("selected")) element.classList.remove("accent-color-primary");
    }
  }
}
