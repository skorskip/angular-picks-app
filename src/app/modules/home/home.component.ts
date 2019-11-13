import { Component, OnInit,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
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

  constructor(@Inject(DOCUMENT) document, private router:Router, private weekService:WeekService){
    this.router.events.subscribe((event) => {
        if(event instanceof NavigationStart) {
          var url = event.url;

          if(url.indexOf("myPicks") != -1) {
            this.highlight("my-picks");
          } else if(url.indexOf("weeklyGames") != -1) {
            this.highlight("weekly-games");
          } else if(url.indexOf("standings") != -1) {
            this.highlight("standings");
          } else if(url.indexOf("profile") != -1) {
            this.highlight("my-profile");
          }
        }
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.resize(document.getElementById("side-nav").scrollWidth);
    var element = document.getElementById(this.selected);

    if(element != null){
      element.classList.add("accent-color-primary");
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

    if(selected != null && prevSelected != null) {
      selected.classList.add("accent-color-primary");
      selected.classList.add("selected");
      prevSelected.classList.remove("accent-color-primary");
      prevSelected.classList.remove("selected");
      this.selected = id;
    }    
  }

  navigateToPage(link:string){
    this.router.navigate(['/'+link]);
  }

  navigateToMyPicks() {
    this.weekService.getCurrentWeek().subscribe( week => {
      this.router.navigate(['/myPicks/' + week.season + '/' + week.number]);
    });
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

  getCurrentPageLogin(): boolean {
    return (this.router.url.indexOf('login') > -1);
  }

}
