import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, SimpleChange } from '@angular/core';
import { SideNavService } from 'src/app/services/side-nav/side-nav.service';
import { AnnouncementsService } from 'src/app/data-models/announcements/announcements.service';
import { User } from 'src/app/data-models/user/user';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, AfterViewInit {

  @Input() title = "";
  @Input() subtitle = "";

  @Input() subDisplayEditButton = false;
  @Input() subPicksUpdated = false;

  @Output() navEditClicked = new EventEmitter();
  @Output() navSubmitEdit= new EventEmitter();
  @Output() navPicksUpdated = new EventEmitter();

  user = new User();

  edit = false;
  messages = false;
  largeScreen = false;
  loadingEdits = false;

  constructor(
    private sideNavService: SideNavService,
    private announcementService: AnnouncementsService,
    private authService: AuthenticationService,
  ) { 
    this.announcementService.announcementChange.subscribe(value => {
      this.messages = value;
    });
  }

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    this.announcementService.getAnnoucements().subscribe(messages => {
      this.messages = messages.announcements > 0;
      if(this.messages) {
        this.announcementService.announcementChange.next(this.messages);
      }
    })
  }

  ngOnChanges(changes: SimpleChange) {
    if((changes["subPicksUpdated"]?.currentValue != changes["subPicksUpdated"]?.previousValue) && changes["subPicksUpdated"]?.currentValue) {
      this.edit = false;
      this.loadingEdits = false;
      this.navPicksUpdated.emit(false);
    }
  }

  ngAfterViewInit() {
    this.resize(document.getElementById("side-nav").scrollWidth);
  }

  toggleSideNav(){
    this.sideNavService.toggleSidebarVisibility();
  }

  editPicks(){
    this.edit = true;
    this.navEditClicked.emit(true);
  }

  submitEdits() {
    this.loadingEdits = true;
    this.navSubmitEdit.emit(true);
  }

  resize(size: number) {
    if(size > 650) {
      this.largeScreen = true;
    } else {
      this.largeScreen = false;
    }
  }

  onResize(event){
    this.resize(event.target.innerWidth);
  }

}
