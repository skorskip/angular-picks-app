import { ChangeDetectorRef, Component, OnInit,Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { SideNavService } from 'src/app/services/side-nav/side-nav.service';
import { LeagueService } from 'src/app/data-models/league/league.service';
import { AnnouncementsService } from 'src/app/data-models/announcements/announcements.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  events: string[] = [];
  selected;
  messageCount = 0;
  
  constructor(
    private router:Router, 
    private themeService:ThemeService,
    private sideNavService: SideNavService,
    private leagueService: LeagueService,
    private announcementsService: AnnouncementsService,
    ){

    this.router.events.subscribe((event) => {
        if(event instanceof NavigationStart) {
          this.highlightByRoute(event.url);
        }
    });

    this.announcementsService.announcementChange.subscribe(value => {
      if(value) {
        this.announcementsService.getAnnoucements().subscribe((messages) => {
          this.messageCount = messages.announcements;
        });
      }
    });
  }

  ngOnInit() {}

  highlightByRoute(route: string) {
    if(route.indexOf("picks") != -1) {
      this.highlight("my-picks");
    } else if(route.indexOf("games") != -1) {
      this.highlight("weekly-games");
    } else if(route.indexOf("standings") != -1) {
      this.highlight("standings");
    } else if(route.indexOf("profile") != -1) {
      this.highlight("my-profile");
    } else if(route.indexOf("messages") != -1) {
      this.highlight("messages");
    }
  }

  ngAfterViewInit() {
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
  }

  goToChatPage() {
    this.leagueService.getLeagueSettings().subscribe((settings) => {
      window.open("https://slack.com/app_redirect?channel=" + settings.messageSource.channel, '_blank');
    });
  }

  getLogo(): string {
    var theme = this.themeService.getTheme();
    if(theme == 'light'){
      return "../../../assets/icons/pickem_logo_soft.svg";
    } else {
      return "../../../assets/icons/pickem_logo_dark.svg"
    }
  }

  sideNavState(event) {
    if(!event) {
      this.sideNavService.toggleSidebarVisibility();
    }
  }

}
