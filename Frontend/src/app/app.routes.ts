import { Routes } from '@angular/router';
import { authGuard } from './modules/auth/guard/auth.guard';
import { roleTypeEnum } from './common/enums/role.enum';
import { ForbiddenComponent } from './common/components/forbidden/forbidden.component';
import { ProfileComponent } from './common/components/profile/profile.component';
import { PublicLayoutComponent } from './common/layouts/public-layout/public-layout.component';
import { PrivateLayoutComponent } from './common/layouts/private-layout/private-layout.component';

export const routes: Routes = [
        {
                path: '',
                redirectTo: 'auth',
                pathMatch: 'full',
        },
        {
                path: 'auth',
                component: PublicLayoutComponent,
                children: [
                        {
                                path: '',
                                loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
                        }
                ]
        },
        {
                path: '',
                component: PrivateLayoutComponent,
                children: [
                        {
                                path: 'blog',
                                loadChildren: () => import('./modules/blog/blog.module').then(m => m.BlogModule),
                                canActivate: [authGuard], data: { roles: [roleTypeEnum.Reader, roleTypeEnum.SubscribedReader, roleTypeEnum.Author] }
                        },
                        {
                                path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
                                canActivate: [authGuard],
                                data: { roles: [roleTypeEnum.Admin, roleTypeEnum.SuperAdmin] }
                        },
                        {
                                path: 'forbidden',
                                component: ForbiddenComponent
                        },
                        {
                                path: 'profile',
                                component: ProfileComponent
                        }
                ]
        }
       
];
