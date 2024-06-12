import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BlogModel } from '../../Models/blog.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogFormModel } from '../../Models/blogFrom.model';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../auth/Models/user.model';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../Services/blog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScreenEnum } from '../../../shared/enums/screen.enum';
import { CommonService } from '../../../shared/Services/common.service';
import { AuthServiceService } from '../../../auth/Services/Auth/auth-service.service';



@Component({
  selector: 'app-new-blog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, TextFieldModule, MatSlideToggleModule, CommonModule],
  templateUrl: './new-blog.component.html',
  styleUrl: './new-blog.component.css'
})

export class NewBlogComponent {

  blog: BlogModel;
  title: string = "Add Blog";
  blogForm: FormGroup;
  user: User;
  id: number;

  constructor(
    private router: Router, 
    private blogService: BlogService,  
    private route: ActivatedRoute, 
    private commonService: CommonService,
    private authService: AuthServiceService
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.title = "Edit Blog"
    }
    this.patchData();
    this.blogForm = new FormGroup<BlogFormModel>({
      blogId: new FormControl(0),
      title: new FormControl('', [Validators.required]),
      content: new FormControl("", [Validators.required]),
      authorId: new FormControl(0),
      isPremium: new FormControl(false, [Validators.required]),
    })
  }

  private patchData = ():void => {
    if (this.id > 0) {
      this.blogService.getBlog(ScreenEnum.Blog, this.id).subscribe({
        next: (data) => {
          this.blogForm.patchValue({
            title: data.data.title,
            content: JSON.parse(data.data.content),
            isPremium: data.data.isPremium,
            blogId: data.data.blogId
          })
        }
      })
    }
  }

  handleBack = ():void => {
    this.router.navigate(["/blog/blogs"]);
  }

  get f() {
    return this.blogForm.controls;
  }

  handleSubmit = ():void => {
    this.blogForm.markAllAsTouched();
    if (this.blogForm.valid) {
      this.blogForm.value.content = JSON.stringify(this.blogForm.value.content);
      this.blogForm.value.authorId = this.user.authorId;

      if (!this.id) {

        this.blogService.postBlog(this.blogForm.value, 1).subscribe({
          next: () => {
            this.router.navigate(["/blog/blogs"]);
          },
          error: (err) => {
            this.commonService.openSnackBar(err.error.message);
          }
        })
      } else {
        this.blogService.editBlog(this.blogForm.value, 1).subscribe({
          next: () => {
            this.router.navigate(["/blog/blogs"]);
          },
          error: (err) => {
            this.commonService.openSnackBar(err.error.message);
          }
        })
      }

    }
  }


}
