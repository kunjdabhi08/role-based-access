import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogService } from '../../Services/blog.service';
import { NavbarComponent } from '../../../shared/Components/navbar/navbar.component';
import { BlogModel } from '../../Models/blog.model';
import { MatButtonModule } from '@angular/material/button';
import { ScreenEnum } from '../../../shared/enums/screen.enum';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [NavbarComponent, MatButtonModule, RouterLink],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit {
  blog: BlogModel;
  id:number;

  constructor(
    private route: ActivatedRoute, 
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'))
    this.fetchBlogById(this.id)
  }

  public parseJson = (content: string): string => {
    return JSON.parse(content);
  }

  private fetchBlogById = (id: number) => {
    this.blogService.getBlog(ScreenEnum.Blog, id).subscribe({
      next: (data)=> {
        this.blog = data.data;
        this.blog.content = JSON.parse(this.blog.content);
      }
    })
  }

}
