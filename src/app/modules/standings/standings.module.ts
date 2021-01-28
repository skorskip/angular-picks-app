import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module'; 
import { StandingsComponent } from './standings.component';
import { SharedModule } from '../../shared/shared.module';
import { MyPicksDashboardModule } from '../my-picks-dashboard/my-picks-dashboard.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MyPicksDashboardModule,
    SharedModule,
    Ng2SearchPipeModule,
    FormsModule
  ],
  declarations: [
    StandingsComponent
  ]
})
export class StandingsModule { }
