import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { StandingsComponent } from '../modules/standings/standings.component';
import { ProfileComponent } from '../modules/profile/profile.component';
import { PicksDashboardComponent } from '../modules/picks-dashboard/picks-dashboard.component';
import { MyPicksDashboardComponent } from '../modules/my-picks-dashboard/my-picks-dashboard.component';
import { LoginComponent } from '../modules/login/login.component';
import { MessagesComponent } from '../modules/messages/messages.component';

import { AuthGuard } from '../services/guard/guard.service';

const routes: Routes = [
  { path: '', component: PicksDashboardComponent, canActivate: [AuthGuard] },
  { path: 'picks/:season/:seasonType/:week', component: MyPicksDashboardComponent, canActivate: [AuthGuard], data: {animation: 'Picks'} },
  { path: 'picks', component: MyPicksDashboardComponent, canActivate: [AuthGuard], data: {animation: 'Picks'} },
  { path: 'games/:season/:seasonType:/:week', component: PicksDashboardComponent, canActivate: [AuthGuard], data: {animation: 'Games'}  },
  { path: 'games', component: PicksDashboardComponent, canActivate: [AuthGuard], data: {animation: 'Games'}  },
  { path: 'standings', component: StandingsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
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
