import { Component, OnInit, ViewChild } from '@angular/core';
import { BlogService } from '../../Services/blog.service';
import { BlogModel } from '../../Models/blog.model';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../auth/Models/user.model';
import { roleTypeEnum } from '../../../shared/enums/role.enum';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { AccessModel } from '../../../admin/Models/access.model';
import { AuthServiceService } from '../../../auth/Services/Auth/auth-service.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { ScreenEnum } from '../../../shared/enums/screen.enum';
import { PermissionEnum } from '../../../admin/enums/permission.enum';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginator,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    DatePipe,
    MatSortModule,
    MatInputModule,
    MatFormField,
    CommonModule
  ],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent implements OnInit {
  dataSource = new MatTableDataSource<BlogModel>();
  blogs: BlogModel[];

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  displayedColumns: string[] = ['index', 'title', 'author', 'date', 'approved', 'premium', 'actions'];
  roleEnum = roleTypeEnum;


  user: User;
  permission: AccessModel;

  constructor(private blogService: BlogService, private router: Router, private _snackBar: MatSnackBar, private authService: AuthServiceService) {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (this.user.roleId === roleTypeEnum.Reader || this.user.roleId === roleTypeEnum.SubscribedReader) {
      this.permission = authService.getPermission(ScreenEnum.Blog)
    } else {

      this.permission = authService.getPermission(ScreenEnum.Author);
    }

  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    if (!this.permission.accesses[PermissionEnum.Read]) {
      this.router.navigate(["/forbidden"])
    }
    this.fetchBlogs();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public handleRead = (id: number, isPremium: boolean): void => {
    if (isPremium == true && this.user.roleId === roleTypeEnum.SubscribedReader || isPremium == false) {
      this.router.navigate([`/blog/read/${id}`])
    } else {
      this._snackBar.open("Subscribe to read this blog", "Ok", {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition
      })
    }

  }

  private fetchBlogs = (): void => {
    if (this.user.roleId === roleTypeEnum.Author) {
      this.blogService.getByAuthor(this.user.id, ScreenEnum.Blog).subscribe({
        next: (data: any) => {
          if (data.statusCode && data.statusCode === 401) {
            localStorage.clear();
            this.router.navigate([""]);
          }
          this.dataSource.data = data.data;
          this.blogs = data.data;
        },

        error: (err) => {
          alert(err.error.message)
        }
      })
    } else {
      this.blogService.getBlogs(ScreenEnum.Blog, true).subscribe({
        next: (data: any) => {
          if (data.statusCode && data.statusCode === 401) {
            localStorage.clear();
            this.router.navigate([""]);
          }

          this.dataSource.data = data.data;
          this.blogs = data.data;
        },
        error: (err) => {
          alert(err.error.message)
        }
      })
    }
  }

  public handleDelete = (blogid: number): void => {
    if (!this.permission.accesses[PermissionEnum.Delete]) {
      this._snackBar.open("You don't have permission", "Ok", {
        verticalPosition: this.verticalPosition,
        horizontalPosition: this.horizontalPosition,
      })
      return;
    }
    if (confirm("Are you sure")) {
      this.blogService.deleleBlog(blogid, 1).subscribe({
        next: () => {
          this.fetchBlogs();
        },
        error: (err) => {
          alert(err.error.message)
        }
      })
    }
  }

  public handleAddBlog = (): void => {
    if (!this.permission.accesses[PermissionEnum.Create]) {
      this._snackBar.open("You don't have permission", "Ok", {
        verticalPosition: this.verticalPosition,
        horizontalPosition: this.horizontalPosition,
      })
      return;
    }
    this.router.navigate(["/blog/add"]);
  }

  public handleEditBlog = (blogId: number): void => {
    if (!this.permission.accesses[PermissionEnum.Edit]) {
      this._snackBar.open("You don't have permission", "Ok", {
        verticalPosition: this.verticalPosition,
        horizontalPosition: this.horizontalPosition,
      })
      return;
    }
    this.router.navigate([`/blog/edit/${blogId}`])
  }


  public searchRecord = (event): void => {
    let search: string = event.target.value;
    if (search.trim().length > 2) {
      this.dataSource.data = this.blogs.filter((x) => x.title.toLowerCase().includes(search.trim().toLowerCase()) || x.authorName.toLowerCase().includes(search.trim().toLowerCase()))
    }
    else {
      this.dataSource.data = this.blogs
    }
  }

}
