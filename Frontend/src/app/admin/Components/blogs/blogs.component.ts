import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { roleTypeEnum } from '../../../shared/enums/role.enum';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
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
import { CommonService } from '../../../shared/Services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfimartionDialogComponent } from '../../../shared/Components/confimartion-dialog/confimartion-dialog.component';
import { BlobOptions } from 'buffer';

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
  isFilterChecked: boolean;

  displayedColumns: string[] = ['index', 'title', 'author', 'date', 'actions'];

  roleEnum = roleTypeEnum;

  blogs: BlogModel[];

  permission: AccessModel;

  dataSource = new MatTableDataSource<BlogModel>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private blogService: BlogService, 
    private router: Router, 
    private authService: AuthServiceService, 
    private dialog: MatDialog, 
    private commonService: CommonService
  ) {
    this.permission = this.authService.getPermission(ScreenEnum.Admin);
  }

 
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
          sessionStorage.clear();
          this.router.navigate([""]);
        }
        this.blogs = data.data;
        this.dataSource.data = data.data;

      },
      error: (err) => {
        this.commonService.openSnackBar(err.error.message);
      }
    })

  }

  public handleApprove = (blogId: number): void => {
    if (!this.permission.accesses[PermissionEnum.Edit]) {
      this.commonService.openForbiddenDialog();
      return;
    }
    if (confirm("Are you sure?")) {
      this.blogService.approveBlog(blogId, ScreenEnum.Admin).subscribe({
        next: () => {
          this.commonService.openSnackBar("Blog Approved");
          this.fetchBlogs();
        },
        error: (err) => {
          this.commonService.openSnackBar(err.error.message);
        }
      })
    }
  }

  public handleDelete = (blogid: number): void => {
    if (!this.permission.accesses[PermissionEnum.Delete]) {
      this.commonService.openForbiddenDialog();
      return;
    }
    
    const confirm = this.commonService.takeConfirmation();
    confirm.beforeClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.blogService.deleleBlog(blogid, 5).subscribe({
          next: (data) => {
            if (data.success)
              this.fetchBlogs();
          },
          error: (err) => {
            this.commonService.openSnackBar(err.error.message);
          }
        })
      }

    })
  }

  public handleFilterChange = (checked: boolean): void => {
    if (checked) {
      this.isFilterChecked = checked
      this.blogs = this.dataSource.data.filter((blog) => blog.isApproved === false);
      this.dataSource.data = this.blogs;
    } else {
      this.isFilterChecked = checked
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
