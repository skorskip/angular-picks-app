import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { MaterialModule } from '../../material/material.module';
import { RegisterModule } from '../../modules/register/register.module';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RegisterModule
  ],
  declarations: [LoginComponent],
  exports: [
    LoginComponent
  ]
})
export class LoginModule { }
