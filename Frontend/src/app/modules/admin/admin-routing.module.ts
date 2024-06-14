import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionComponent } from './pages/permission/permission.component';
import { PermissionsComponent } from './pages/permissions/permissions.component';
import { UsersComponent } from './pages/users/users.component';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { BlogComponent } from '../blog/pages/blog/blog.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'permission/:id', component: PermissionComponent },
  { path: 'permissions', component: PermissionsComponent },
  { path: 'blogs', component: BlogsComponent },
  {path: 'blog/read/:id', component: BlogComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
