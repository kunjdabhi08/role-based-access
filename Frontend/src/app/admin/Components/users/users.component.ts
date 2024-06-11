import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../../../auth/Models/user.model';
import { UserService } from '../../Services/user.service';
import { RouterLink } from '@angular/router';
import { AuthServiceService } from '../../../auth/Services/Auth/auth-service.service';
import { AccessModel } from '../../Models/access.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ScreenEnum } from '../../../shared/enums/screen.enum';
import { PermissionEnum } from '../../enums/permission.enum';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, RouterLink, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatIconModule  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  dataSource = new MatTableDataSource<User>();
  permissions: AccessModel;
  users: User[];
  constructor(private userService: UserService, private authService: AuthServiceService, private router: Router, private snackbar: MatSnackBar){
    this.permissions = this.authService.getPermission(ScreenEnum.User);
  }

  displayedColumns:string[] = ["index", "name", "role","email" ,"subscriber", "actions"]

  ngOnInit(): void {
    
    this.fetchUsers();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private fetchUsers = (): void=> {
    if(!this.permissions.accesses[PermissionEnum.Read]){
      this.router.navigate(["/forbidden"])
    }
    this.userService.getUsers().subscribe({
      next: (data)=> {
        this.users = data.data;
        this.dataSource.data = data.data;
      },
      error: (e) => {
        alert(e.error.message);
      }
    })
  }

  public handleDelete = (id: number): void => {
    if(!this.permissions.accesses[PermissionEnum.Delete]){
      this.snackbar.open("You don't have permission", "Ok", {
        verticalPosition: "top",
        horizontalPosition: "end"
      })
      return;
    }
    
    if(confirm("are you sure?")){
      this.userService.deleteUser(id, ScreenEnum.User).subscribe({
        next:(): void => {
          this.fetchUsers(); 
        },
        error:(e):void => {
          alert(e.error.message);
        }
      })
    }
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
}
