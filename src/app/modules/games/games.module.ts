import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GamesComponent } from './games.component';
import { MyPicksDashboardModule } from '../my-picks-dashboard/my-picks-dashboard.module';
import { PicksDashboardModule } from '../picks-dashboard/picks-dashboard.module';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [GamesComponent],
  imports: [
    CommonModule,
    MyPicksDashboardModule,
    PicksDashboardModule,
    SharedModule
  ],
  exports: [
    GamesComponent
  ]
})
export class GamesModule { };