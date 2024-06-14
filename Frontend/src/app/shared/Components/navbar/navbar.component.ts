import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthServiceService } from '../../../auth/Services/Auth/auth-service.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '../../../auth/Models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  user: User;

  public isLoggedIn$: Observable<boolean>;

  constructor(private router: Router, private authService: AuthServiceService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isAuth;
    if(this.authService.getUser()){
      this.authService.isAuth.next(true);
    }
    this.user = this.authService.getUser();
  }

  public handleLogout = (): void => {
    sessionStorage.clear();
    this.router.navigate([""]);
    this.authService.isAuth.next(false);
  }
  
}
