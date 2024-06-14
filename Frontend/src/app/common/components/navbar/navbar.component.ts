import { Component, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '../../../modules/auth/models/user.model';
import { AuthServiceService } from '../../../modules/auth/services/Auth/auth-service.service';

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

  constructor(private router: Router, private authService: AuthServiceService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isAuth;
    if(this.authService.getUser()){
      this.authService.isAuth.next(true);
    }
  }


  public handleLogout = (): void => {
    sessionStorage.clear();
    this.router.navigate([""]);
    this.authService.isAuth.next(false);
    
  }
  
}
