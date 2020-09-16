import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserStatsComponent } from '../components/user-stats/user-stats.component';
import { GameComponent } from '../components/game/game.component';
import { WeeksComponent } from '../components/weeks/weeks.component';
import { TeamComponent } from '../components/team/team.component';
import { PickStatusComponent } from '../components/pick-status/pick-status.component';
import { UsersPickDataComponent } from '../components/users-pick-data/users-pick-data.component';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule
  ],
  declarations: [
    UsersPickDataComponent,
    GameComponent,
    WeeksComponent,
    TeamComponent,
    PickStatusComponent,
    NavBarComponent,
    UserStatsComponent
  ],
  exports: [
    UsersPickDataComponent,
    GameComponent,
    WeeksComponent,
    TeamComponent,
    PickStatusComponent,
    MaterialModule,
    NavBarComponent,
    UserStatsComponent
  ]
})
export class SharedModule { }
