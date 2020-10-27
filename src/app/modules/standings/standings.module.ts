import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module'; 
import { StandingsComponent } from './standings.component';
import { SharedModule } from '../../shared/shared.module';
import { MyPicksDashboardModule } from '../my-picks-dashboard/my-picks-dashboard.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MyPicksDashboardModule,
    SharedModule
  ],
  declarations: [
    StandingsComponent
  ]
})
export class StandingsModule { }
