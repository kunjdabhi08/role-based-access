import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { LoginFormModel } from '../../Models/LoginForm.model';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { AuthServiceService } from '../../Services/Auth/auth-service.service';
import { ResponseModel } from '../../../Models/Response.model';
import { User } from '../../Models/user.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { roleTypeEnum } from '../../../shared/enums/role.enum';
Router
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, MatIconModule, FormsModule, CommonModule, ReactiveFormsModule, MatCardModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  public hide = true;
  public permissionError!: string;
  public clickEvent(event: MouseEvent) {
    event.preventDefault();
    this.hide = !this.hide;
    event.stopPropagation();
  }
  constructor(private authService: AuthServiceService, private router: Router, private route: ActivatedRoute, private snackbar: MatSnackBar) {
    authService.autoLogin();
  }

  public loginForm!: FormGroup;



  ngOnInit(): void {
    this.loginForm = new FormGroup<LoginFormModel>({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    })
  }


  public get f() {
    return this.loginForm.controls
  }

  public handleSubmit = () => {
    this.loginForm.markAllAsTouched();

    if (!this.loginForm.invalid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({

        next: (data: ResponseModel<User>) => {
          if (data.success) {
            this.authService.isAuth.next(true);
            localStorage.setItem('user', JSON.stringify(data.data));
            localStorage.setItem('token', JSON.stringify(data.token));
            localStorage.setItem('permission', JSON.stringify(data.permissions));
            if (data.data.roleId === roleTypeEnum.Reader || data.data.roleId === roleTypeEnum.SubscribedReader || data.data.roleId === roleTypeEnum.Author) {
              this.router.navigate(["/blog/blogs"])
            }
            else if (data.data.roleId === roleTypeEnum.SuperAdmin) {
              this.router.navigate(["admin/"])
            }
            else {
              this.router.navigate(["admin/blogs"])
            }
          }
        },

        error: (err) => {
          this.snackbar.open(err.error.message, "Ok", {
            horizontalPosition: "end",
            verticalPosition: "top"
          })
        }
        
      })
    }
  }
}
