import { ChangeDetectorRef, Component, OnInit,Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, RouterOutlet } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { SideNavService } from 'src/app/services/side-nav/side-nav.service';
import { LeagueService } from 'src/app/data-models/league/league.service';
import { AnnouncementsService } from 'src/app/data-models/announcements/announcements.service';
import { slideInAnimation } from 'src/app/app-routing/app-routing-animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [ slideInAnimation ]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  events: string[] = [];
  openedSmall: boolean;
  opened:boolean;
  profileOpened:boolean;
  largeScreen = false as boolean;
  sideMenuType;
  profileMenuType;
  mobileQuery: MediaQueryList;
  
  private _mobileQueryListener: () => void;

  constructor(
    private router:Router, 
    private sideNavService: SideNavService,
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher){

    this.sideNavService.sidebarVisibilityChange.subscribe(value => {
      if(!this.largeScreen) {
        this.opened = value;
      }
    });

    this.sideNavService.profileVisibilityChange.subscribe(value => {
      this.profileOpened = value;
    });

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngAfterViewInit() {
    this.resize(document.getElementById("side-nav").scrollWidth);
  }

  onResize(event) {
    this.resize(event.target.innerWidth);
  }

  resize(windowSize: number) {
    if(windowSize > 950){
      this.largeScreen = true;
      this.opened = true;
      this.profileOpened = true;
      this.sideMenuType = "side";
      this.profileMenuType = "side";
    } else {
      this.opened = false;
      this.profileOpened = false;
      this.largeScreen = false;
      this.sideMenuType = "push";
      this.profileMenuType = "over";
    }
  }
  
  sideProfileState(event) {
    if(!event) {
      this.sideNavService.toggleProfileVisibility();
    }
  }

  getCurrentPageLogin(): boolean {
    return (this.router.url.indexOf('login') > -1);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
