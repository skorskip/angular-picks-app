import { ChangeDetectorRef, Component, OnInit,Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { SideNavService } from 'src/app/services/side-nav/side-nav.service';
import { slideInAnimation } from 'src/app/animations/app-routing-animation';

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
  largeScreen = false as boolean;
  sideMenuType;
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
      this.sideMenuType = "side";
    } else {
      this.opened = false;
      this.largeScreen = false;
      this.sideMenuType = "push";
    }
  }

  getCurrentPageLogin(): boolean {
    return (this.router.url.indexOf('login') > -1);
  }

  sideNavChange(event: boolean) {
    if(!event) {
      this.sideNavService.setSidebarVisibility(event);
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    //TODO:: Add animations only when on one page
    // return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
