import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SideNavService } from 'src/app/services/side-nav/side-nav.service';
import { AnnouncementsService } from 'src/app/data-models/announcements/announcements.service';
import { User } from 'src/app/data-models/user/user';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  @Input() title = "";
  @Input() subtitle = "";
  @Input() showEditButton = false;

  @Output() editPickSelected = new EventEmitter();
  @Output() submitEditsSelected = new EventEmitter();
  user = new User();


  edit = false;
  messages = false;

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

  toggleSideNav(){
    this.sideNavService.toggleSidebarVisibility();
  }

  toggleProfile(){
    this.sideNavService.toggleProfileVisibility();
  }

  editPicks(){
    this.edit = true;
    this.editPickSelected.emit(true);
  }

  submitEdits() {
    this.edit = false;
    this.submitEditsSelected.emit(true);
  }

}
