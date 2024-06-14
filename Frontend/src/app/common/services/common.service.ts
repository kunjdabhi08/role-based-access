import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfimartionDialogComponent } from '../components/confimartion-dialog/confimartion-dialog.component';
import * as CryptoJS from 'crypto-js';
import { ForbiddenDialogComponent } from '../components/forbidden-dialog/forbidden-dialog.component';
import { AccessService } from '../../modules/admin/services/access.service';
import { PermissionModel } from '../../modules/admin/models/permission.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseModel } from '../models/Response.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  key: string = "a1!b2@3c#d4$"
  permission: BehaviorSubject<PermissionModel> = new BehaviorSubject<PermissionModel>(null);

  constructor(
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private accessService: AccessService,
  ) { }

  public openSnackBar = (message: string): void => {
    this.snackbar.open(message, "Ok", {
      horizontalPosition: "center",
      verticalPosition: "bottom",
      duration: 2000
    })
  }

  public takeConfirmation = (message?: string): MatDialogRef<ConfimartionDialogComponent, any> => {
    var confirm = this.dialog.open(ConfimartionDialogComponent, {
      width: '500px',
      data: { message: message }
    })

    return confirm;
  }

  public encrypt = (data: string): string => {
    return CryptoJS.AES.encrypt(data, this.key).toString();
  }


  public decrypt = (data: string): string => {
    return CryptoJS.AES.decrypt(data, this.key).toString(CryptoJS.enc.Utf8);
  }

  public openForbiddenDialog = (back: boolean): void => {
    this.dialog.open(ForbiddenDialogComponent, {
      width: '500px',
      data: {isBack: back}
    })
  }

  public fetchPermissionForScreen = (roleId: number, screenId: number): Observable<ResponseModel<PermissionModel>> => {
    return this.accessService.getByScreen(roleId, screenId)
    
  }

}
