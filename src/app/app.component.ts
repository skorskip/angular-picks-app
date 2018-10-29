import { Component, OnInit,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

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

  constructor(@Inject(DOCUMENT) document){}

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
    if(this.largeScreen){
      document.getElementById(this.selectedLarge).classList.add("select");
    } else {
      document.getElementById(this.selectedSmall).classList.add("select");
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
    if(id != this.selectedLarge && this.largeScreen){
      document.getElementById(id).classList.add("select");
      document.getElementById(this.selectedLarge).classList.remove("select");
      this.selectedLarge = id;
    } else if(id != this.selectedSmall && !this.largeScreen){
      document.getElementById(id).classList.add("select");
      document.getElementById(this.selectedSmall).classList.remove("select");
      this.selectedSmall = id;
    }
  }
}
