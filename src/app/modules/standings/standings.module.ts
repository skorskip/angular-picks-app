import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module'; 
import { MyPicksDashboardModule } from '../my-picks-dashboard/my-picks-dashboard.module';
import { StandingsComponent } from './standings.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MyPicksDashboardModule
  ],
  declarations: [
    StandingsComponent
  ]
})
export class StandingsModule { }
