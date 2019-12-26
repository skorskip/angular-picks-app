import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module'; 
import { SharedModule } from '../../shared/shared.module';

import { PicksDashboardComponent, SubmitPicksDialog, NoPicksDialog, PicksErrorDialog, PicksOverLimitDialog } from './picks-dashboard.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    PicksDashboardComponent,
    SubmitPicksDialog,
    NoPicksDialog,
    PicksErrorDialog,
    PicksOverLimitDialog  
  ],
  entryComponents: [
    SubmitPicksDialog,
    NoPicksDialog,
    PicksErrorDialog,
    PicksOverLimitDialog
  ]
})
export class PicksDashboardModule { }