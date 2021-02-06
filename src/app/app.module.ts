import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { MaterialModule } from './material/material.module'; 
import { HttpClientModule } from '@angular/common/http';

import { ProfileModule } from './modules/profile/profile.module';
import { StandingsModule} from './modules/standings/standings.module';
import { HomeModule } from './modules/home/home.module';
import { LoginModule } from './modules/login/login.module';
import { MessagesModule } from './modules/messages/messages.module';
import { NavigationModule } from './modules/navigation/navigation.module';
import { GamesModule } from './modules/games/games.module';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { WeekService } from './data-models/week/week.service';

import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';
import * as Hammer from 'hammerjs';

Amplify.configure({...awsconfig, ssr: true});

export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
      'pan': {direction: Hammer.DIRECTION_HORIZONTAL, velocity: 0.4, threshold: 200},
      'swipe': {direction: Hammer.DIRECTION_ALL}
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HammerModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    HomeModule,
    StandingsModule,
    ProfileModule,
    LoginModule,
    MessagesModule,
    NavigationModule,
    GamesModule,
    AmplifyUIAngularModule
  ],
  providers: [WeekService, {
    provide: HAMMER_GESTURE_CONFIG,
    useClass: MyHammerConfig
  }],
  bootstrap: [AppComponent]
})

export class AppModule { }
