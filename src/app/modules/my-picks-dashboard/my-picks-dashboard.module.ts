import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module'; 
import { SharedModule } from '../../shared/shared.module';

import { MyPicksDashboardComponent } from '../my-picks-dashboard/my-picks-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    MyPicksDashboardComponent
  ],
  exports: [
    MyPicksDashboardComponent
  ]
})
export class MyPicksDashboardModule { }
