import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { NavbarComponent } from '../../../../common/components/navbar/navbar.component';
import { BlogModel } from '../../models/blog.model';
import { MatButtonModule } from '@angular/material/button';
import { ScreenEnum } from '../../../../common/enums/screen.enum';
import { User } from '../../../auth/models/user.model';
import { AuthServiceService } from '../../../auth/services/Auth/auth-service.service';
import { roleTypeEnum } from '../../../../common/enums/role.enum';
import { SafeHtmlPipe } from '../../../../common/pipes/safeHtml';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [NavbarComponent, MatButtonModule, RouterLink, SafeHtmlPipe ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit {

  blog: BlogModel;
  id:number;
  isFromAdmin: boolean;
  user: User;

  constructor(
    private route: ActivatedRoute, 
    private blogService: BlogService,
    private router: Router,
    private authService: AuthServiceService
  ) {
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.id = Number(this.route.snapshot.paramMap.get('id'))
    this.fetchBlogById(this.id)
  }

  public parseJson = (content: string): string => {
    return JSON.parse(content);
  }

  public handleBack = (): void => {
    this.user.roleId === roleTypeEnum.Admin || roleTypeEnum.SuperAdmin ?  this.router.navigate(["/admin/blogs"]) :  this.router.navigate(["/blog/blogs"])
  }

  private fetchBlogById = (id: number) => {
    let screenId = this.user.roleId === (roleTypeEnum.Admin || roleTypeEnum.SuperAdmin) ? ScreenEnum.Admin : ScreenEnum.Blog;
    this.blogService.getBlog(screenId, id).subscribe({
      next: (data)=> {
        this.blog = data.data;
        // this.blog.content = JSON.parse(this.blog.content);
      }
    })
  }
}
