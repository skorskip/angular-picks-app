import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { StandingsComponent } from '../modules/standings/standings.component';
import { ProfileComponent } from '../modules/profile/profile.component';
import { PicksDashboardComponent } from '../modules/picks-dashboard/picks-dashboard.component';
import { MyPicksDashboardComponent } from '../modules/my-picks-dashboard/my-picks-dashboard.component';
import { LoginComponent } from '../modules/login/login.component';

import { AuthGuard } from '../services/guard/guard.service';
import { AppComponent } from '../app.component';

const routes: Routes = [
  { path: '', component: AppComponent, canActivate: [AuthGuard] },
  { path: 'myPicks/:season/:week', component: MyPicksDashboardComponent, canActivate: [AuthGuard] },
  { path: 'weeklyGames', component: PicksDashboardComponent, canActivate: [AuthGuard] },
  { path: 'standings', component: StandingsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent}
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
