import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthPageGuard } from './../route-guards/auth-page.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthPageGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [AuthPageGuard] },
];

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    AngularMaterialModule,
  ],
  providers: [AuthPageGuard],
})
export class AuthModule {}
