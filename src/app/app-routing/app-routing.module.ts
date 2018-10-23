import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StandingsComponent } from '../standings/standings.component';
import { ProfileComponent } from '../profile/profile.component';
import { PicksDashboardComponent } from '../picks-dashboard/picks-dashboard.component';
import { MyPicksDashboardComponent } from '../my-picks-dashboard/my-picks-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/weeklyPicks', pathMatch: 'full' },
  { path: 'myPicks', component: MyPicksDashboardComponent },
  { path: 'weeklyPicks', component: PicksDashboardComponent },
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
