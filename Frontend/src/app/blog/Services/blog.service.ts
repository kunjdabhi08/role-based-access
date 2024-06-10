import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../../Models/Response.model';
import { BlogModel } from '../Models/blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  private apiUrl = "https://localhost:7270/api/blogs"

  public getBlogs = (screenId: number, isUser: boolean):Observable<ResponseModel<BlogModel[]>> => {
    return this.http.get<ResponseModel<BlogModel[]>>(this.apiUrl + '/Get'+ "?screenId=" + screenId + `&user=${isUser}`)
  }
  
  public getBlog = (screenId: number, blogId: number): Observable<ResponseModel<BlogModel>> => {
    return this.http.get<ResponseModel<BlogModel>>(`${this.apiUrl}/Get/${blogId}?` + `screenId=${screenId}`)
  }

  public getByAuthor = (authorId: number, screenId: number): Observable<ResponseModel<BlogModel[]>> => {
    return this.http.get<ResponseModel<BlogModel[]>>(this.apiUrl + `/GetByAuthor/${authorId}`+ "?screenId=" + screenId)
  }

  public postBlog = (blog: BlogModel, screenId: number): Observable<ResponseModel<BlogModel>> => {
    return this.http.post<ResponseModel<BlogModel>>(this.apiUrl + "/create?screenId=" + screenId, blog)
  }


  public editBlog = (blog: BlogModel, screenId: number): Observable<ResponseModel<BlogModel>> => {
    return this.http.put<ResponseModel<BlogModel>>(this.apiUrl + "/Edit?screenId=" + screenId, blog)
  }

  public deleleBlog = (blogId: number, screenId: number): Observable<ResponseModel<null>> => {
    return this.http.delete<ResponseModel<null>>(`${this.apiUrl}/delete/${blogId}?` + `screenId=${screenId}`)
  }

  public approveBlog = (blogId: number, screenId: number): Observable<ResponseModel<BlogModel>> => {
    return this.http.put<ResponseModel<BlogModel>>(this.apiUrl + `/Approve/${blogId}?screenId=` + screenId, null)
  }

}
