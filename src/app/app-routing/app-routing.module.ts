import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GamesComponent } from '../games/games.component';
import { StandingsComponent } from '../standings/standings.component';
import { ProfileComponent } from '../profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/picks', pathMatch: 'full' },
  { path: 'picks', component: GamesComponent },
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
