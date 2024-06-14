import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../../../auth/models/user.model';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { AuthServiceService } from '../../../auth/services/Auth/auth-service.service';
import { Router } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ScreenEnum } from '../../../../common/enums/screen.enum';
import { CommonService } from '../../../../common/services/common.service';
import { PermissionModel } from '../../models/permission.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    RouterLink,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})

export class UsersComponent {
  dataSource = new MatTableDataSource<User>();
  permission: PermissionModel;
  users: User[];
  user: User;
  displayedColumns: string[] = ["index", "name", "role", "email", "subscriber", "actions"]

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService,
    private authService: AuthServiceService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.fetchPermsisionForScreen(this.user.roleId, ScreenEnum.User);


  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public handleDelete = (id: number): void => {
    if (!this.permission.delete) {
      this.commonService.openForbiddenDialog(false);
      return;
    }

    const confirm = this.commonService.takeConfirmation();
    confirm.beforeClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.userService.deleteUser(id, ScreenEnum.User).subscribe({
          next: (): void => {
            this.fetchUsers();
            this.commonService.openSnackBar("User deleted");
          }
        })
      }
    })
  }

  public searchRecord = (event): void => {
    let search: string = event.target.value;
    if (search.trim().length > 2) {
      this.dataSource.data = this.users.filter((x) => x.name.toLowerCase().includes(search.trim().toLowerCase()) || x.email.toLowerCase().includes(search.trim().toLowerCase()))
    }
    else {
      this.dataSource.data = this.users;
    }
  }

  private fetchUsers = (): void => {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data.data;
        this.dataSource.data = data.data;
      }
    })
  }

  private fetchPermsisionForScreen = (roleId: number, screenId: number): void => {
    this.commonService.fetchPermissionForScreen(roleId, screenId).subscribe({
      next: (data) => {
        this.permission = data.data;
        this.fetchUsers();
      }
    })
  }
}
