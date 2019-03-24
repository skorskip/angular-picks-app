import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { MaterialModule } from './material/material.module'; 

import { HttpClientModule }    from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

import { ProfileModule } from './modules/profile/profile.module';
import { StandingsModule} from './modules/standings/standings.module';
import { MyPicksDashboardModule } from './modules/my-picks-dashboard/my-picks-dashboard.module';
import { MyStatsModule } from './modules/my-stats/my-stats.module';
import { PicksDashboardModule } from './modules/picks-dashboard/picks-dashboard.module';

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
    MyPicksDashboardModule,
    MyStatsModule,
    PicksDashboardModule,
    StandingsModule,
    ProfileModule,
  // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
  // and returns simulated server responses.
  // Remove it when a real server is ready to receive requests.
  HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
