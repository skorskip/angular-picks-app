import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module'; 
import { SharedModule } from '../../shared/shared.module';

import { MyPicksDashboardComponent, EditPicksDialog } from './my-picks-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    MyPicksDashboardComponent,
    EditPicksDialog
  ],
  entryComponents: [
    EditPicksDialog
  ],
  exports: [
    MyPicksDashboardComponent
  ]
})
export class MyPicksDashboardModule { }
