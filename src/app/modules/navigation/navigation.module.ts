import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import { AppRoutingModule } from '../../app-routing/app-routing.module';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { ProfileModule } from '../../modules/profile/profile.module';

@NgModule({
  declarations: [NavigationComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    MaterialModule,
    SharedModule,
    ProfileModule
  ],
  exports: [
    NavigationComponent
  ]
})
export class NavigationModule { }
