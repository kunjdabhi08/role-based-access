import { Routes } from '@angular/router';
import { authGuard } from './auth/Guard/auth.guard';
import { roleTypeEnum } from './shared/enums/role.enum';
import { ForbiddenComponent } from './shared/Components/forbidden/forbidden.component';
import { ProfileComponent } from './shared/Components/profile/profile.component';

export const routes: Routes = [
        {path: '', loadChildren: ()=>import('./auth/auth.module').then(m=>m.AuthModule) },
        {path: 'blog', loadChildren: ()=>import('./blog/blog.module').then(m=>m.BlogModule), canActivate: [authGuard], data: {roles:[roleTypeEnum.Reader,roleTypeEnum.SubscribedReader, roleTypeEnum.Author]}},
        {path: 'admin', loadChildren: ()=>import('./admin/admin.module').then(m=>m.AdminModule), canActivate: [authGuard], data: {roles:[roleTypeEnum.Admin,roleTypeEnum.SuperAdmin]}},
        {path: 'forbidden', component: ForbiddenComponent},
        {path: 'profile', component: ProfileComponent}
];
