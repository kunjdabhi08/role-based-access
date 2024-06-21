import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { BlogComponent } from './pages/blog/blog.component';
import { NewBlogComponent } from './pages/new-blog/new-blog.component';
import { RatingComponent } from './pages/rating/rating.component';


const routes: Routes = [
  {path: 'blogs', component: BlogsComponent},
  {path: 'read/:id', component: BlogComponent, data:{isFromAdmin: false}},
  {path: 'add' , component: NewBlogComponent,  pathMatch: 'full'},
  {path: 'edit/:id' , component: NewBlogComponent, pathMatch: 'full'},
  {path: 'rating/:id' , component: RatingComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule]
})
export class BlogRoutingModule { }
