import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module'; 
import { GamesModule } from '../games/games.module';
import { StandingsComponent } from './standings.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    GamesModule,
    SharedModule
  ],
  declarations: [
    StandingsComponent
  ]
})
export class StandingsModule { }
