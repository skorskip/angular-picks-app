import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { MaterialModule } from './material/material.module'; 
import { HttpClientModule } from '@angular/common/http';

import { ProfileModule } from './modules/profile/profile.module';
import { StandingsModule} from './modules/standings/standings.module';
import { MyPicksDashboardModule } from './modules/my-picks-dashboard/my-picks-dashboard.module';
import { PicksDashboardModule } from './modules/picks-dashboard/picks-dashboard.module';
import { HomeModule } from './modules/home/home.module';
import { LoginModule } from './modules/login/login.module';
import { MessagesModule } from './modules/messages/messages.module';
import { NavigationModule } from './modules/navigation/navigation.module';

import { WeekService } from './data-models/week/week.service'
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    HomeModule,
    MyPicksDashboardModule,
    PicksDashboardModule,
    StandingsModule,
    ProfileModule,
    LoginModule,
    MessagesModule,
    NavigationModule
  ],
  providers: [WeekService],
  bootstrap: [AppComponent]
})

export class AppModule { }
