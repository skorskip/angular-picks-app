import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SideNavService } from 'src/app/services/side-nav/side-nav.service';
import { AnnouncementsService } from 'src/app/data-models/announcements/announcements.service';

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

  edit = false;
  messages = false;

  constructor(
    private sideNavService: SideNavService,
    private announcementService: AnnouncementsService,
  ) { 
    this.announcementService.announcementChange.subscribe(value => {
      this.messages = value;
    });
  }

  ngOnInit() {
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

  editPicks(){
    this.edit = true;
    this.editPickSelected.emit(true);
  }

  submitEdits() {
    this.edit = false;
    this.submitEditsSelected.emit(true);
  }

}
