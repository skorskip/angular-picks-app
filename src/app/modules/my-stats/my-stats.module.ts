import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module'; 

import { MyStatsComponent, NavigateToPicksDialog } from './my-stats.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    MyStatsComponent,
    NavigateToPicksDialog
  ],
  entryComponents: [NavigateToPicksDialog]
})
export class MyStatsModule { }
