import { Inject, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../Services/Auth/auth-service.service';
import { User } from '../Models/user.model';

export const authGuard: CanActivateFn = (route, state) => {

  const authService: AuthServiceService = inject(AuthServiceService);
  const router:Router =  inject(Router);

  
  if(!authService.isLoggedIn()){
    router.navigate([""])
    return false;
  }

  let user:User = JSON.parse(localStorage.getItem('user'));
  
  let allowedRoles:number[] = route.data["roles"] as number[];  

  if(!allowedRoles.includes(user.roleId)){
    router.navigate([""])
    return false;
  }

  return true;
};


