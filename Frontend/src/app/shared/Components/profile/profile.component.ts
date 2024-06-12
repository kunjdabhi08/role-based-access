import { Component } from '@angular/core';
import { User } from '../../../auth/Models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { roleTypeEnum } from '../../enums/role.enum';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserService } from '../../../admin/Services/user.service';
import { Location } from '@angular/common';
import { CommonService } from '../../Services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfimartionDialogComponent } from '../confimartion-dialog/confimartion-dialog.component';
import { AuthServiceService } from '../../../auth/Services/Auth/auth-service.service';

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

  constructor(
    private userService: UserService,  
    private location: Location, 
    private commonService: CommonService, 
    private dialog: MatDialog,
    private authService: AuthServiceService
  ) {
    this.user = this.authService.getUser();
  }

  public handleChange = (checked: boolean): void => {
    let subscribe = checked ? 1 : 0;
    let snackbarMsg = checked ? "Subscription Successful" : "Unsubscribed Successfully"
    let confirmationMessage = checked ? "Are you sure want to subscribe" : "Are you sure want to unsubscribe"
   
    const confirmationDialog = this.dialog.open(ConfimartionDialogComponent, {
      width: '500px',
      data: {message:confirmationMessage}
    })

    confirmationDialog.beforeClosed().subscribe((confirm: boolean) => {
      if(confirm){
        this.userService.subscribeUser(this.user.id, subscribe).subscribe({
          next: () => {
            this.user.roleId = checked ? roleTypeEnum.SubscribedReader : roleTypeEnum.Reader;
            sessionStorage.setItem('user', this.commonService.encrypt(JSON.stringify(this.user)));
            this.commonService.openSnackBar(snackbarMsg);
          },
          error: (e) => {
            alert(e.error.message)
          }
        })
      }
    })
  }

  public goBack = (): void => {
    this.location.back();
  }

  


}
