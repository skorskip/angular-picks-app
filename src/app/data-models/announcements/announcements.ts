import { Message } from './message';

export class Announcements {
    announcements: number;
    announcement_date: string;
    messages: Message[];
    date: Date;

    constructor() {
		  this.announcements = 0;
		  this.announcement_date = "";
      this.messages = [];
      this.date = new Date();
	}
}