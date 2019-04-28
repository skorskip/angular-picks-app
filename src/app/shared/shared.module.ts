import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';

import { GameComponent } from '../components/game/game.component';
import { WeeksComponent } from '../components/weeks/weeks.component';
import { TeamComponent } from '../components/team/team.component';
import { PickStatusComponent } from '../components/pick-status/pick-status.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    GameComponent,
    WeeksComponent,
    TeamComponent,
    PickStatusComponent
  ],
  exports: [
    GameComponent,
    WeeksComponent,
    TeamComponent,
    PickStatusComponent,
    MaterialModule
  ]
})
export class SharedModule { }
