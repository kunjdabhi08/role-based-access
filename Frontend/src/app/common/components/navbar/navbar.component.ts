import { Component, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../../modules/auth/services/Auth/auth-service.service';
import { CommonService } from '../../services/common.service';
import { User } from '../../../modules/auth/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent 
{

  public isLoggedIn$: Observable<boolean>;
  user: User;

  constructor(
    private authService: AuthServiceService,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isAuth;
    if(this.user = this.authService.getUser()){
      this.authService.isAuth.next(true);
    }
    
  }


  public handleLogout = (): void => {
    this.authService.logout();
    
  }
  
}
