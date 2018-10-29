import { Component, OnInit,Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Picks Dashboard';
  events: string[] = [];
  openedSmall: boolean;
  opened:boolean;
  largeScreen: boolean;

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

  onResize(event) {
    console.log(event.target.innerWidth);
    if(event.target.innerWidth > 950){
      this.largeScreen = true;
      this.openedSmall = false;
    } else {
      this.opened = false;
      this.largeScreen = false;
      this.openedSmall = true;
    }
  }
}
