import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { StandingsComponent } from '../modules/standings/standings.component';
import { ProfileComponent } from '../modules/profile/profile.component';
import { PicksDashboardComponent } from '../modules/picks-dashboard/picks-dashboard.component';
import { MyPicksDashboardComponent } from '../modules/my-picks-dashboard/my-picks-dashboard.component';
import { MyStatsComponent } from '../modules/my-stats/my-stats.component';

const routes: Routes = [
  { path: '', redirectTo: '/weeklyGames', pathMatch: 'full' },
  { path: 'myPicks/:weekId', component: MyPicksDashboardComponent },
  { path: 'weeklyGames', component: PicksDashboardComponent },
  { path: 'myStats', component: MyStatsComponent },
  { path: 'standings', component: StandingsComponent },
  { path: 'profile', component: ProfileComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
