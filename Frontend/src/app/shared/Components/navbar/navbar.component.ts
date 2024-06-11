import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../auth/Models/user.model';
import { MatIconModule } from '@angular/material/icon';
import { AuthServiceService } from '../../../auth/Services/Auth/auth-service.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
 
  public loggedin: boolean;
  user: User;
  

  constructor(private router: Router, private authService: AuthServiceService) {}

  ngOnInit(): void {
    this.loggedin = this.authService.isAuth.value;
    console.log(this.loggedin)
    if(this.loggedin){
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }


  public handleLogout = (): void => {
    localStorage.clear();
    this.router.navigate([""]);
    this.authService.isAuth.next(false);
  }

}
