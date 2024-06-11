import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { signupFormModel } from '../../Models/SignupForm.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthServiceService } from '../../Services/Auth/auth-service.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatInputModule, MatCardModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatButtonModule, RouterLink, MatIconModule, MatSlideToggleModule, MatSelectModule, MatOptionModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  public hide = true;
  public clickEvent = (event: MouseEvent): void => {
    event.preventDefault();
    this.hide = !this.hide;
    event.stopPropagation();
  }

  constructor(private authService: AuthServiceService, private router: Router, private snackbar: MatSnackBar) { }

  signupForm!: FormGroup;

  ngOnInit(): void {
    this.signupForm = new FormGroup<signupFormModel>({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
      confirmPassword: new FormControl('', [Validators.required]),
      roleId: new FormControl(5, [Validators.required])
    })
  }


  public handleSubmit = (): void => {
    this.signupForm.markAllAsTouched();
    if (this.signupForm.valid) {
      if (!(this.signupForm.value.password === this.signupForm.value.confirmPassword)) {
        alert("password and confirm password do not match");
        return;
      }
      this.authService.register(this.signupForm.value).subscribe({
        next: () => {
          this.router.navigate([""]);
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

  public get f() {
    return this.signupForm.controls;
  }


}
