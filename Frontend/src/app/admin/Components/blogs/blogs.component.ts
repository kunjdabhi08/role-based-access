import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../auth/Models/user.model';
import { roleTypeEnum } from '../../../shared/enums/role.enum';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { BlogService } from '../../../blog/Services/blog.service';
import { BlogModel } from '../../../blog/Models/blog.model';
import { AuthServiceService } from '../../../auth/Services/Auth/auth-service.service';
import { AccessModel } from '../../Models/access.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ScreenEnum } from '../../../shared/enums/screen.enum';
import { PermissionEnum } from '../../enums/permission.enum';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginator,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatCheckboxModule,
    MatSortModule,
    MatSortHeader,
    DatePipe,
    MatFormField,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent implements OnInit, AfterViewInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  displayedColumns: string[] = ['index', 'title', 'author', 'date', 'actions'];
  roleEnum = roleTypeEnum;
  blogs: BlogModel[];
  dataSource = new MatTableDataSource<BlogModel>();
  user: User;
  permission: AccessModel;
  constructor(private blogService: BlogService, private router: Router, private _snackBar: MatSnackBar, private authService: AuthServiceService) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.permission = authService.getPermission(ScreenEnum.Admin);
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

  private fetchBlogs = (): void => {
    this.blogService.getBlogs(ScreenEnum.Admin, false).subscribe({
      next: (data: any) => {
        if (data.statusCode && data.statusCode === 401) {
          localStorage.clear();
          this.router.navigate([""]);
        }
        this.blogs = data.data;
        this.dataSource.data = data.data;

      },
      error: (err) => {
        alert(err.error.message)
      }
    })

  }

  public handleApprove = (blogId: number): void => {
    if (!this.permission.accesses[PermissionEnum.Edit]) {
      this._snackBar.open("You don't have permission", "Ok", {
        verticalPosition: this.verticalPosition,
        horizontalPosition: this.horizontalPosition,
      })
      return;
    }
    if (confirm("Are you sure?")) {
      this.blogService.approveBlog(blogId, ScreenEnum.Admin).subscribe({
        next: () => {
          this._snackBar.open("Blog approved", "Ok", {
            horizontalPosition: "end",
            verticalPosition: "top"
          });
          this.fetchBlogs();
        },
        error: (e) => {
          alert(e.error.message);
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
      this.blogService.deleleBlog(blogid, 5).subscribe({
        next: () => {
          this.fetchBlogs();
        },
        error: (err) => {
          alert(err.error.message)
        }
      })
    }
  }

  public handleFilterChange = (checked: boolean): void => {
    if (checked) {
      this.blogs = this.dataSource.data.filter((blog) => blog.isApproved === false);
      this.dataSource.data = this.blogs;
    } else {
      this.fetchBlogs();
    }
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
