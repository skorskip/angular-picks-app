import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameComponent } from '../components/game/game.component';
import { WeeksComponent } from '../components/weeks/weeks.component';
import { TeamComponent } from '../components/team/team.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    GameComponent,
    WeeksComponent,
    TeamComponent
  ],
  exports: [
    GameComponent,
    WeeksComponent,
    TeamComponent
  ]
})
export class SharedModule { }
