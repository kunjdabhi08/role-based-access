import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatSliderModule} from '@angular/material/slider';
import { BlogService } from '../../services/blog.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../common/services/common.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [MatSliderModule, CommonModule, FormsModule, MatButtonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent {

  value: number;
  id: number;
  currentRating: number;


  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.id = Number(this.route.snapshot.params['id'])
  }

  ngOnInit(): void {
    this.fetchBlog();
  }

  private fetchBlog = ():void => {
    this.blogService.getBlog(6,this.id).subscribe({
      next: (data) => {
        if(data.success){
          this.currentRating = Number(data.data.rating.toPrecision(2));
        }
      }
    })
  }

  
  public handleRate = ():void => {
    this.blogService.rateBlog(this.id, this.value).subscribe({
      next:(data)=> {
        if(data.success){
          this.commonService.openSnackBar("Blog rating successful");
          this.fetchBlog();
        }
      }
    })
  }

}
