import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';

import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { AuthGuard } from '../route-guards/auth.guard';

const routes: Routes = [
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  {
    path: 'edit/:id',
    component: PostCreateComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    AngularMaterialModule,
  ],
  providers: [AuthGuard],
})
export class PostsModule {}
