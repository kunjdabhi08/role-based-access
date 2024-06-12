import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccessService } from '../../Services/access.service';
import { AccessModel } from '../../Models/access.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AuthServiceService } from '../../../auth/Services/Auth/auth-service.service';
import { ScreenEnum } from '../../../shared/enums/screen.enum';
import { CommonService } from '../../../shared/Services/common.service';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [
    MatCheckboxModule, 
    MatButtonModule, 
    RouterLink
  ],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css'
})
export class PermissionComponent {
  permissions: AccessModel[]
  id: number;
  allPermission: boolean[];
  isEdited: boolean[];
  permission: AccessModel;


  constructor(
    private route: ActivatedRoute, 
    private accessService: AccessService, 
    private authService: AuthServiceService, 
    private commonService: CommonService
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'))
    this.permission = this.authService.getPermission(ScreenEnum.Permission);
    this.fetchPermission()
  }

  fetchPermission = (): void => {
    this.accessService.getAccessByRole(this.id).subscribe({
      next: (data) => {
        this.permissions = data.data;
        this.allPermission = data.data.map((p) => {
          return p.accesses.every(p => p === true)
        })
        this.isEdited = this.permissions.map(() => false)
      },
      error: (err) => {
        this.commonService.openSnackBar(err.error.message);
      }
    })
  }

  public checkAll = (checked: boolean, index: number): void => {
    this.isEdited[index] = true;
    if (checked) {
      this.permissions[index].accesses.fill(true);
    } else {
      this.permissions[index].accesses.fill(false);
    }
  }

  public handleChange = (checked: boolean, index: number, indexOfPermission: number): void => {
    this.isEdited[index] = true;
    if (checked) {
      this.permissions[index].accesses[indexOfPermission] = true;
      this.allPermission[index] = this.permissions[index].accesses.every(p => p === true);
    } else {
      this.allPermission[index] = false;
      this.permissions[index].accesses[indexOfPermission] = false;
    }
  }

  public savePermission = (index: number) => {
    if (!this.permission.accesses[1]) {
      this.commonService.openForbiddenDialog();
      return;
    }
    this.accessService.editAccess(this.permissions[index]).subscribe({
      next: (data) => {
        if (data.success) {

          this.isEdited[index] = false;
        }
      },
      error: (err) => {
        this.commonService.openSnackBar(err.error.message);
      }
    })
  }

}
