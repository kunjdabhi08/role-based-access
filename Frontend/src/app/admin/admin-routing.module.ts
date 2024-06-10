import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsComponent } from './Components/permissions/permissions.component';
import { PermissionComponent } from './Components/permission/permission.component';
import { UsersComponent } from './Components/users/users.component';
import { BlogsComponent } from './Components/blogs/blogs.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'permission/:id', component: PermissionComponent },
  { path: 'permissions', component: PermissionsComponent },
  { path: 'blogs', component: BlogsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
