import { Component, Input, OnInit, SimpleChange } from '@angular/core';

@Component({
  selector: 'pick-logo',
  templateUrl: './pick-logo.component.html',
  styleUrls: ['./pick-logo.component.scss']
})
export class PickLogoComponent implements OnInit {

  @Input() size = '';
  hideElement = true;

  constructor() { }
  
  ngOnInit(): void {
  }

  ngOnChanges(event: SimpleChange) {
    if(event["size"].isFirstChange()) {
      this.hideElement = false;
    }
  }

}
