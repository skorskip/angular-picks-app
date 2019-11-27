import { Component, OnInit,Inject, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { WeekService } from '../../data-models/week/week.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  events: string[] = [];
  openedSmall: boolean;
  opened:boolean;
  largeScreen = false as boolean;
  selected;
  sideMenuType;

  constructor(@Inject(DOCUMENT) document, private router:Router, private weekService:WeekService){
    this.router.events.subscribe((event) => {
        if(event instanceof NavigationStart) {
          this.highlightByRoute(event.url);
        }
    });
  }

  ngOnInit() {}

  highlightByRoute(route: string) {
    console.log(route);
    if(route.indexOf("picks") != -1) {
      this.highlight("my-picks");
    } else if(route.indexOf("games") != -1) {
      this.highlight("weekly-games");
    } else if(route.indexOf("standings") != -1) {
      this.highlight("standings");
    } else if(route.indexOf("profile") != -1) {
      this.highlight("my-profile");
    }
  }

  ngAfterViewInit() {
    this.highlightByRoute(this.router.url);
    this.resize(document.getElementById("side-nav").scrollWidth);
    var element = document.getElementById(this.selected);

    if(element != null){
      element.classList.add("primary-background");
      element.classList.add("base");
      element.classList.add("selected");
    }
  }

  onResize(event) {
    this.resize(event.target.innerWidth);
  }

  resize(windowSize: number) {
    if(windowSize > 950){
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
    var selected = document.getElementById(id);
    var prevSelected = document.getElementById(this.selected);

    if(selected != null) {
      selected.classList.add("primary-background");
      selected.classList.add("base");
      selected.classList.add("selected");
      this.selected = id;
    }
    if(prevSelected != null){
      prevSelected.classList.remove("primary-background");
      prevSelected.classList.remove("base");
      prevSelected.classList.remove("selected");
    }    
  }

  navigateToPage(link:string){
    this.router.navigate(['/'+link]);
  }

  navigateToMyPicks() {
    this.weekService.getCurrentWeek().subscribe( week => {
      this.router.navigate(['/picks/' + week.season + '/' + week.number]);
    });
  }

  mouseover(event:any){
    var element  = document.getElementById(event.path[2].id);
    if(element != null){
      element.classList.add("primary-background");
      element.classList.add("base");
    }
  }

  mouseout(event:any){
    var element  = document.getElementById(event.path[2].id);
    if(element != null){
      if(!element.classList.contains("selected")){ 
        element.classList.remove("primary-background");
        element.classList.remove("base");
      };
    }
  }

  toggle(){
    if(this.opened && this.largeScreen == false) {
      this.opened = false;
    } else {
      this.opened = true;
    }
  }

  getCurrentPageLogin(): boolean {
    return (this.router.url.indexOf('login') > -1);
  }

}
