import { Component, OnInit,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { WeekService } from '../../data-models/week/week.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  events: string[] = [];
  openedSmall: boolean;
  opened:boolean;
  largeScreen = false as boolean;
  selected = "weekly-games";
  sideMenuType;

  constructor(@Inject(DOCUMENT) document, private router:Router, private weekService:WeekService){}

  ngOnInit() {
    if(document.getElementById("side-nav").scrollWidth > 950){
      this.largeScreen = true;
      this.opened = true;
      this.sideMenuType = "side";

    } else {
      this.largeScreen = false;
      this.sideMenuType = "push";

    }
  }

  ngAfterViewInit() {
    var element = document.getElementById(this.selected);

    if(element != null){
      element.classList.add("accent-color-primary");
      element.classList.add("selected");
    }
  }

  onResize(event) {
    if(event.target.innerWidth > 950){
      this.largeScreen = true;
      this.opened = true;
      this.sideMenuType = "side";
    } else {
      this.opened = false;
      this.largeScreen = false;
      this.sideMenuType = "push";
    }
  }

  highlight(id:string) {
    document.getElementById(id).classList.add("accent-color-primary");
    document.getElementById(id).classList.add("selected");
    document.getElementById(this.selected).classList.remove("accent-color-primary");
    document.getElementById(this.selected).classList.remove("selected");
    this.selected = id;
    
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

  toggle(){
    if(this.opened && this.largeScreen == false) {
      this.opened = false;
    } else {
      this.opened = true;
    }
  }

}
