import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogService } from '../../Services/blog.service';
import { NavbarComponent } from '../../../shared/Components/navbar/navbar.component';
import { BlogModel } from '../../Models/blog.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [NavbarComponent, MatButtonModule, RouterLink],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit {

  constructor(private route: ActivatedRoute, private blogService: BlogService) {
    
  }
  id:number;
  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'))
    this.fetchBlogById(this.id)
  }

  blog: BlogModel;

  private fetchBlogById = (id: number) => {
    this.blogService.getBlog(1, id).subscribe({
      next: (data)=> {
        this.blog = data.data;
      }, 
      error: (err)=> {
        alert(err.error.message);
      }
    })
  }

}
