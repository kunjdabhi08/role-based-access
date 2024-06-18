import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { roleTypeEnum } from '../../../../common/enums/role.enum';
import { MatIconModule } from '@angular/material/icon';
import { BlogModel } from '../../../blog/models/blog.model';
import { BlogService } from '../../../blog/services/blog.service';
import { AuthServiceService } from '../../../auth/services/Auth/auth-service.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ScreenEnum } from '../../../../common/enums/screen.enum';
import { PermissionModel } from '../../models/permission.model';
import { User } from '../../../auth/models/user.model';
import { CommonService } from '../../../../common/services/common.service';

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

  isFilterChecked: boolean = false;
  displayedColumns: string[] = ['index', 'title', 'author', 'date', 'actions'];
  roleEnum = roleTypeEnum;
  blogs: BlogModel[];
  permission: PermissionModel;
  dataSource = new MatTableDataSource<BlogModel>();
  user: User;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private blogService: BlogService,
    private router: Router,
    private authService: AuthServiceService,
    private commonService: CommonService
  ) {
  }


  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.fetchPermsisionForScreen(this.user.roleId, ScreenEnum.Admin);
    this.fetchBlogs();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  public handleApprove = (blogId: number): void => {
    if (!this.permission.edit) {
      this.commonService.openForbiddenDialog(false);
      return;
    }

    const confirm = this.commonService.takeConfirmation("Are you sure?");
    confirm.beforeClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.blogService.approveBlog(blogId, ScreenEnum.Admin).subscribe({
          next: () => {
            this.commonService.openSnackBar("Blog Approved");
            this.fetchBlogs();
            if (this.isFilterChecked) {
              this.handleFilterChange(this.isFilterChecked)
            }
          }
        })
      }
    })
  }

  public handleDelete = (blogid: number): void => {
    if (!this.permission.delete) {
      this.commonService.openForbiddenDialog(false);
      return;
    }
    const confirm = this.commonService.takeConfirmation();
    confirm.beforeClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.blogService.deleleBlog(blogid, ScreenEnum.Admin).subscribe({
          next: (data) => {
            if (data.success)
              this.fetchBlogs();
            this.commonService.openSnackBar("Blog deleted Successfully");
          }
        })
      }

    })
  }

  public handleFilterChange = (checked: boolean): void => {
    this.isFilterChecked = checked
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

  public checkPermission = (): void => {
    this.commonService.fetchPermissionForScreen(this.user.roleId, ScreenEnum.User).subscribe({
      next: (data) => {
        if (data.success && !data.data.view) {
          this.commonService.openForbiddenDialog(false);
          return;
        }
        this.router.navigate(["/admin"])
      }
    })
  }

  public handleRead = (id: number): void => {
    if (!this.permission.view) {
      this.commonService.openForbiddenDialog(false);
      return;
    }
    this.router.navigate([`/admin/blog/read/${id}`], { state: { isFromAdmin: true } })
  }

  private fetchBlogs = (): void => {
    this.blogService.getBlogs(ScreenEnum.Admin, false).subscribe({
      next: (data: any) => {
        if (data.statusCode && data.statusCode === 401) {
          sessionStorage.clear();
          this.router.navigate([""]);
        }
        this.blogs = data.data;
        this.dataSource.data = data.data;

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
