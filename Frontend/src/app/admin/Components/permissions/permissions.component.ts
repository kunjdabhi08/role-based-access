import { Component } from '@angular/core';
import { AccessService } from '../../Services/access.service';
import { RoleService } from '../../Services/role.service';
import { MatTableModule } from '@angular/material/table';
import { RoleModel } from '../../Models/role.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../../auth/Services/Auth/auth-service.service';
import { AccessModel } from '../../Models/access.model';
import { PermissionEnum } from '../../enums/permission.enum';
import { CommonService } from '../../../shared/Services/common.service';


@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatButtonModule, RouterLink],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css'
})
export class PermissionsComponent {

  dataSource: RoleModel[];
  displayedColumns: string[] = ["index", "roleName", "actions"];
  permission: AccessModel;

  constructor(private roleService: RoleService, private router: Router, private authService: AuthServiceService,  private commonService: CommonService) {
    this.permission = this.authService.getPermission(3);
  }


  ngOnInit(): void {
    this.fetchRoles();
  }

  private fetchRoles = (): void => {
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.dataSource = data.data;
      },
      error: (err) => {
        this.commonService.openSnackBar(err.error.message);
      }
    })
  }

  public handleManagePermission = (roleId: number): void => {
    if (!this.permission.accesses[PermissionEnum.Read]) {
      this.commonService.openForbiddenDialog();
      return;
    }
    this.router.navigate([`/admin/permission/${roleId}`])
  }

}
