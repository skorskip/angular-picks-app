import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { SideNavService } from 'src/app/services/side-nav/side-nav.service';
import { AnnouncementsService } from 'src/app/data-models/announcements/announcements.service';
import { Announcements } from 'src/app/data-models/announcements/announcements';
import { User } from 'src/app/data-models/user/user';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  events: string[] = [];
  selected;
  messageCount = 0;
  announcements = new Announcements();
  user = new User();
  largeScreen = false;

  constructor(
    private authService: AuthenticationService,
    private router:Router, 
    private sideNavService: SideNavService,
    private announcementsService: AnnouncementsService
    ){

    this.router.events.subscribe((event) => {
        if(event instanceof NavigationStart) {
          this.highlightByRoute(event.url);
        }
    });

    this.announcementsService.announcementChange.subscribe(value => {
      if(value) {
        this.announcementsService.getAnnoucements().subscribe((messages) => {
          this.announcements = messages;
          this.messageCount = messages.announcements;
        });
      }
    });
  }

  ngOnInit() {
    this.user = this.authService.currentUserValue;

    if(this.user != null) {
      this.announcementsService.getAnnoucements().subscribe((messages) => {
        this.announcements = messages;
        this.messageCount = messages.announcements;
      });
    }
  }

  highlightByRoute(route: string) {
    if(route.indexOf("games") != -1) {
      this.highlight("weekly-games");
    } else if(route.indexOf("standings") != -1) {
      this.highlight("standings");
    } else if(route.indexOf("profile") != -1) {
      this.highlight("profile");
    } else if(route.indexOf("messages") != -1) {
      this.highlight("messages");
    }
  }
  
  ngAfterViewInit() {
    this.resize(document.getElementById("side-nav-container").scrollWidth);
    this.highlightByRoute(this.router.url);
    var element = document.getElementById(this.selected);

    if(element != null){
      element.classList.add("primary-background");
      element.classList.add("base");
      element.classList.add("selected");
    }
  }

  highlight(id:string) {
    var selected = document.getElementById(id);
    var prevSelected = document.getElementById(this.selected);

    if(selected != null) {
      selected.classList.add("primary-background");
      selected.classList.add("base");
      selected.classList.add("selected");
      this.selected = id;
    }
    if(prevSelected != null){
      prevSelected.classList.remove("primary-background");
      prevSelected.classList.remove("base");
      prevSelected.classList.remove("selected");
    }    
  }

  navigateToPage(link:string){
    this.router.navigate(['/'+link]);
  }

  mouseover(event:any){
    var element  = document.getElementById(event.path[2].id);
    if(element != null){
      element.classList.add("primary-background");
      element.classList.add("base");
    }
  }

  mouseout(event:any){
    var element  = document.getElementById(event.path[2].id);
    if(element != null){
      if(!element.classList.contains("selected")){ 
        element.classList.remove("primary-background");
        element.classList.remove("base");
      };
    }
  }

  toggle(){
    this.sideNavService.toggleSidebarVisibility();
  }

  getCurrentPageLogin(): boolean {
    return (this.router.url.indexOf('login') > -1);
  }

  goToMessagePage() {
    var checked = new Date();
    this.announcementsService.setAnnouncementCheck(checked.toUTCString());
    this.messageCount = 0;
    this.announcements.announcements = 0
    this.announcementsService.setAnnouncements(this.announcements);
  }

  // Add to with new workspace
  // goToChatPage() {
  //   this.leagueService.getLeagueSettings().subscribe((settings) => {
  //     window.open("https://slack.com/app_redirect?channel=" + settings.messageSource.channel, '_blank');
  //   });
  // }

  logout() {
    this.authService.logout();
    window.location.reload();
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
