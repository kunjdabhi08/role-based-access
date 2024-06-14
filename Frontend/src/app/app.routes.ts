import { Routes } from '@angular/router';
import { authGuard } from './modules/auth/guard/auth.guard';
import { roleTypeEnum } from './common/enums/role.enum';
import { ForbiddenComponent } from './common/components/forbidden/forbidden.component';
import { ProfileComponent } from './common/components/profile/profile.component';

export const routes: Routes = [
        {path: '', loadChildren: ()=>import('./modules/auth/auth.module').then(m=>m.AuthModule) },
        {path: 'blog', loadChildren: ()=>import('./modules/blog/blog.module').then(m=>m.BlogModule), canActivate: [authGuard], data: {roles:[roleTypeEnum.Reader,roleTypeEnum.SubscribedReader, roleTypeEnum.Author]}},
        {path: 'admin', loadChildren: ()=>import('./modules/admin/admin.module').then(m=>m.AdminModule), canActivate: [authGuard], data: {roles:[roleTypeEnum.Admin,roleTypeEnum.SuperAdmin]}},
        {path: 'forbidden', component: ForbiddenComponent},
        {path: 'profile', component: ProfileComponent}
];
