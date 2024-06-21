import { Component, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../../modules/auth/services/Auth/auth-service.service';
import { CommonService } from '../../services/common.service';
import { User } from '../../../modules/auth/models/user.model';
import { roleTypeEnum } from '../../enums/role.enum';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent 
{

  user: User;

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if(this.user = this.authService.getUser()){
      this.authService.isAuth.next(true);
    }
  }

  public handleLogout = (): void => {
    this.authService.logout();
    
  }

  public handleHome = ():void => {
    switch(this.user.roleId){
      case roleTypeEnum.Reader:
      case roleTypeEnum.SubscribedReader:
      case roleTypeEnum.Author:
        this.router.navigate(["/blog/blogs"]);
        break;
      case roleTypeEnum.Admin:
        this.router.navigate(["/admin/blogs"]);
        break;
      case roleTypeEnum.SuperAdmin:
        this.router.navigate(["/admin/"])
    }
  }
  
}
