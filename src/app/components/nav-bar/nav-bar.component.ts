import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { SideNavService } from 'src/app/services/side-nav/side-nav.service';
import { AnnouncementsService } from 'src/app/data-models/announcements/announcements.service';
import { User } from 'src/app/data-models/user/user';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, AfterViewInit {

  @Input() title = "";
  @Input() subtitle = "";
  @Input() showEditButton = false;

  @Output() editPickSelected = new EventEmitter();
  @Output() submitEditsSelected = new EventEmitter();
  user = new User();

  edit = false;
  messages = false;
  largeScreen = false;

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

  ngAfterViewInit() {
    this.resize(document.getElementById("side-nav").scrollWidth);
  }

  toggleSideNav(){
    this.sideNavService.toggleSidebarVisibility();
  }

  toggleProfile(){
    if(!this.largeScreen) {
      this.sideNavService.toggleProfileVisibility();
    }
  }

  editPicks(){
    this.edit = true;
    this.editPickSelected.emit(true);
  }

  submitEdits() {
    this.edit = false;
    this.submitEditsSelected.emit(true);
  }

  resize(size: number) {
    if(size > 950) {
      this.largeScreen = true;
    } else {
      this.largeScreen = false;
    }
  }

  onResize(event){
    this.resize(event.target.innerWidth);
  }

}
