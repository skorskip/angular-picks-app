import { Component, OnInit } from '@angular/core';
import { AnnouncementsService } from 'src/app/data-models/announcements/announcements.service';
import { Message } from 'src/app/data-models/announcements/message';
import { DateFormatterService } from 'src/app/services/date-formatter/date-formatter.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages = [] as Message[];
  loader = true;

  constructor(
    private announcementsService: AnnouncementsService,
    private dateFormatter: DateFormatterService
  ) { }

  ngOnInit() {
    this.announcementsService.getAnnoucements().subscribe((messages) => {
      this.loader = false;
      this.messages = messages.messages;
    });
  }

  formatDate(date: string) {
    return this.dateFormatter.formatDate(new Date(date));
  }

}
