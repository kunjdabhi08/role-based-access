import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccessService } from '../../services/access.service';
import { AccessModel } from '../../models/access.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AuthServiceService } from '../../../auth/services/Auth/auth-service.service';
import { CommonService } from '../../../../common/services/common.service';
import { User } from '../../../auth/models/user.model';
import { PermissionModel } from '../../models/permission.model';
import {
  PermissionEnum,
  PermissionStringEnum,
} from '../../enums/permission.enum';
import { ScreenEnum } from '../../../../common/enums/screen.enum';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, RouterLink],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css',
})
export class PermissionComponent {
  permissions: AccessModel[];
  id: number;
  allPermission: boolean[] | boolean[][];
  isEdited: boolean;
  permission: PermissionModel;
  user: User;

  constructor(
    private route: ActivatedRoute,
    private accessService: AccessService,
    private authService: AuthServiceService,
    private commonService: CommonService
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.fetchPermission();
    this.fetchPermsisionForScreen(this.user.roleId, ScreenEnum.Permission);
  }

  public checkAll = (checked: boolean, index: number): void => {
    this.isEdited = true;
    this.allPermission[index] = checked;
    Object.entries(this.permissions[index]).map((entry) => {
      switch (entry[0]) {
        case PermissionStringEnum.Create:
          this.permissions[index].create = checked;
          if (this.permissions[index].childScreens !== null) {
            this.permissions[index].childScreens[index].create = checked;
          }
          break;
        case PermissionStringEnum.Edit:
          this.permissions[index].edit = checked;
          if (this.permissions[index].childScreens !== null) {
            this.permissions[index].childScreens[index].edit = checked;
          }
          break;
        case PermissionStringEnum.Delete:
          this.permissions[index].delete = checked;
          if (this.permissions[index].childScreens !== null) {
            this.permissions[index].childScreens[index].delete = checked;
          }
          break;
        case PermissionStringEnum.Read:
          this.permissions[index].view = checked;
          if (this.permissions[index].childScreens !== null) {
            this.permissions[index].childScreens[index].view = checked;
          }
          break;
      }
    });
  };

  public handleChange = (
    checked: boolean,
    index: number,
    indexOfPermission: number,
    childIndex?: number
  ): void => {
    this.isEdited = true;

    if (!checked) {
      this.allPermission[index] = false;
    }

    if (childIndex === undefined) {
      switch (indexOfPermission) {
        case PermissionEnum.Create:
          this.permissions[index].create = checked;
          if (this.permissions[index].childScreens !== null) {
            this.permissions[index].childScreens[index].create = checked;
          }
          break;
        case PermissionEnum.Edit:
          this.permissions[index].edit = checked;
          if (this.permissions[index].childScreens !== null) {
            this.permissions[index].childScreens[index].edit = checked;
          }
          break;
        case PermissionEnum.Delete:
          this.permissions[index].delete = checked;
          if (this.permissions[index].childScreens !== null) {
            this.permissions[index].childScreens[index].delete = checked;
          }
          break;
        case PermissionEnum.Read:
          this.permissions[index].view = checked;
          if (this.permissions[index].childScreens !== null) {
            this.permissions[index].childScreens[index].view = checked;
          }
          break;
      }
    } else {
      switch (indexOfPermission) {
        case PermissionEnum.Create:
            this.permissions[index].childScreens[childIndex].create = checked;
          break;
        case PermissionEnum.Edit:
            this.permissions[index].childScreens[childIndex].edit = checked;
          
          break;
        case PermissionEnum.Delete:
            this.permissions[index].childScreens[childIndex].delete = checked;
          
          break;
        case PermissionEnum.Read:
            this.permissions[index].childScreens[childIndex].view = checked;
          
          break;
      }
    }

    if (
      this.permissions[index].create &&
      this.permissions[index].edit &&
      this.permissions[index].delete &&
      this.permissions[index].view
    ) {
      this.allPermission[index] = true;
    }
  };

  public savePermission = () => {
    if (!this.permission.edit) {
      this.commonService.openForbiddenDialog(false);
      return;
    }
    this.accessService.editAccess(this.permissions).subscribe({
      next: (data) => {
        if (data.success) {
          this.commonService.openSnackBar('Permission updated');
          this.fetchPermission();
          this.isEdited = false;
        }
      },
    });
  };

  private fetchPermission = (): void => {
    this.accessService.getAccessByRole(this.id).subscribe({
      next: (data) => {
        this.permissions = data.data;

        this.allPermission = data.data.map((p, index) => {
          for (let key in p) {
            if (
              key === PermissionStringEnum.Create ||
              key === PermissionStringEnum.Edit ||
              key === PermissionStringEnum.Delete ||
              key === PermissionStringEnum.Read
            ) {
              if (p[key] === false) return false;
            }
          }
          return true;
        });
        this.isEdited = false;
      },
    });
  };

  private fetchPermsisionForScreen = (
    roleId: number,
    screenId: number
  ): void => {
    this.commonService.fetchPermissionForScreen(roleId, screenId).subscribe({
      next: (data) => {
        this.permission = data.data;
      },
    });
  };
}
