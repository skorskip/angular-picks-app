import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { AppRoutingModule } from '../../app-routing/app-routing.module';
import { MaterialModule } from '../../material/material.module'; 

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    MaterialModule
  ],
  declarations: [HomeComponent],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
