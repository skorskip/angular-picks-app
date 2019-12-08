import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

import { GameComponent } from '../components/game/game.component';
import { WeeksComponent } from '../components/weeks/weeks.component';
import { TeamComponent } from '../components/team/team.component';
import { PickStatusComponent } from '../components/pick-status/pick-status.component';
import { UsersPickDataComponent } from '../components/users-pick-data/users-pick-data.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    UsersPickDataComponent,
    GameComponent,
    WeeksComponent,
    TeamComponent,
    PickStatusComponent
  ],
  exports: [
    UsersPickDataComponent,
    GameComponent,
    WeeksComponent,
    TeamComponent,
    PickStatusComponent,
    MaterialModule
  ]
})
export class SharedModule { }
