import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { RegisterModule } from '../../modules/register/register.module';

import { ProfileComponent } from './profile.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RegisterModule
  ],
  declarations: [
    ProfileComponent
  ]
})
export class ProfileModule { }
