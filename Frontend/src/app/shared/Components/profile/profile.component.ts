import { Component } from '@angular/core';
import { User } from '../../../auth/Models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { roleTypeEnum } from '../../enums/role.enum';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserService } from '../../../admin/Services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { subscribe } from 'diagnostics_channel';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatButtonModule, MatSlideToggleModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: User;
  roleTypeEnum = roleTypeEnum 
  
  constructor(private userService: UserService,private snackbar: MatSnackBar, private location: Location) {
    this.user = JSON.parse(localStorage.getItem('user'));  
    console.log(this.user.isSubscribed)
  }

  public handleChange = (checked: boolean): void => {
    let subscribe = checked ? 1 : 0;
    let snackbarMsg = checked ? "Subscription Successful" : "Unsubscribed Successfully"
    if(true){
      if(confirm("Are you sure?")){
        this.userService.subscribeUser(this.user.id, subscribe).subscribe({
          next: ()=> {
            this.user.roleId = checked ?  roleTypeEnum.SubscribedReader : roleTypeEnum.Reader;
            localStorage.setItem('user', JSON.stringify(this.user));
            this.snackbar.open(snackbarMsg, "Ok", {
              horizontalPosition: "end",
              verticalPosition: "top"
            })
          },
          error: (e)=> {
            alert(e.error.message)
          }
        })
      }
    }
  }

  public goBack = (): void => {
    this.location.back();
  }



}
