import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { AppRoutingModule } from '../../app-routing/app-routing.module';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { NavigationModule } from '../../modules/navigation/navigation.module';
import { ProfileModule } from '../../modules/profile/profile.module';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    MaterialModule,
    SharedModule,
    NavigationModule,
    ProfileModule,
  ],
  declarations: [HomeComponent],
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }
