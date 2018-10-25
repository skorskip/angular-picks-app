import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Picks Dashboard';
  
  changeTitle(newTitle:string){
    this.title = newTitle;
    this.opened = false;
  }
  events: string[] = [];
  opened: boolean;
}
