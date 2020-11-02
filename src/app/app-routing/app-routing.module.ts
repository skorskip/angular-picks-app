import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { StandingsComponent } from '../modules/standings/standings.component';
import { ProfileComponent } from '../modules/profile/profile.component';
import { LoginComponent } from '../modules/login/login.component';
import { MessagesComponent } from '../modules/messages/messages.component';
import { GamesComponent } from '../modules/games/games.component';

import { AuthGuard } from '../services/guard/guard.service';

const routes: Routes = [
  { path: '', component: GamesComponent, canActivate: [AuthGuard] },
  { path: 'games/:season/:seasonType:/:week', component: GamesComponent, canActivate: [AuthGuard], data: {animation: 'Games'}  },
  { path: 'games', component: GamesComponent, canActivate: [AuthGuard], data: {animation: 'Games'}  },
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
