import { Component } from '@angular/core';
import { RoleService } from '../../Services/role.service';
import { MatTableModule } from '@angular/material/table';
import { RoleModel } from '../../Models/role.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../../auth/Services/Auth/auth-service.service';
import { CommonService } from '../../../shared/Services/common.service';
import { PermissionModel } from '../../Models/permission.model';
import { ScreenEnum } from '../../../shared/enums/screen.enum';
import { User } from '../../../auth/Models/user.model';


@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    MatTableModule, 
    CommonModule, 
    MatButtonModule, 
    RouterLink
  ],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css'
})
export class PermissionsComponent {

  dataSource: RoleModel[];
  displayedColumns: string[] = ["index", "roleName", "actions"];
  permission: PermissionModel;
  user: User;

  constructor(
    private roleService: RoleService, 
    private router: Router, 
    private authService: AuthServiceService,  
    private commonService: CommonService
  ) {
    this.user = this.authService.getUser();
  }


  ngOnInit(): void {
    this.fetchRoles();
    this.fetchPermsisionForScreen(this.user.roleId, ScreenEnum.Permission);
  }

  public handleManagePermission = (roleId: number): void => {
    if (!this.permission.view) {
      this.commonService.openForbiddenDialog();
      return;
    }
    this.router.navigate([`/admin/permission/${roleId}`])
  }

  private fetchRoles = (): void => {
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.dataSource = data.data;
      }
    })
  }

  private fetchPermsisionForScreen = (roleId: number, screenId: number) => {
    this.commonService.fetchPermissionForScreen(roleId, screenId).subscribe({
      next: (data) => {
        this.permission = data.data;
      }
    })
  }

}
