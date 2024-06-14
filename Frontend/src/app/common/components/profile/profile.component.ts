import { Component } from '@angular/core';
import { User } from '../../../modules/auth/models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { roleTypeEnum } from '../../enums/role.enum';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserService } from '../../../modules/admin/services/user.service';
import { Location } from '@angular/common';
import { CommonService } from '../../services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthServiceService } from '../../../modules/auth/services/Auth/auth-service.service';

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

    const confirm = this.commonService.takeConfirmation(confirmationMessage);
    confirm.beforeClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.userService.subscribeUser(this.user.id, subscribe).subscribe({
          next: () => {
            this.user.roleId = checked ? roleTypeEnum.SubscribedReader : roleTypeEnum.Reader;
            sessionStorage.setItem('user', this.commonService.encrypt(JSON.stringify(this.user)));
            this.commonService.openSnackBar(snackbarMsg);
          }
        })
      }
    })

  }

  public goBack = (): void => {
    this.location.back();
  }




}
