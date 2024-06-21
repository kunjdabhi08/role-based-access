import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseModel } from '../../../common/models/Response.model';
import { BlogModel } from '../models/blog.model';
import { enviroment } from '../../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  
  private apiUrl = enviroment.API_URL;

  constructor(private http: HttpClient) { }


  public getBlogs = (screenId: number, isUser: boolean):Observable<ResponseModel<BlogModel[]>> => {
    return this.http.get<ResponseModel<BlogModel[]>>(this.apiUrl + '/blogs/Get'+ "?screenId=" + screenId + `&user=${isUser}`)
  }
  
  public getBlog = (screenId: number, blogId: number): Observable<ResponseModel<BlogModel>> => {
    return this.http.get<ResponseModel<BlogModel>>(`${this.apiUrl}/blogs/Get/${blogId}?` + `screenId=${screenId}`)
  }

  public getByAuthor = (authorId: number, screenId: number): Observable<ResponseModel<BlogModel[]>> => {
    return this.http.get<ResponseModel<BlogModel[]>>(this.apiUrl + `/blogs/GetByAuthor/${authorId}`+ "?screenId=" + screenId)
  }

  public postBlog = (blog: BlogModel, screenId: number): Observable<ResponseModel<BlogModel>> => {
    return this.http.post<ResponseModel<BlogModel>>(this.apiUrl + "/blogs/create?screenId=" + screenId, blog)
  }


  public editBlog = (blog: BlogModel, screenId: number): Observable<ResponseModel<BlogModel>> => {
    return this.http.put<ResponseModel<BlogModel>>(this.apiUrl + "/blogs/Edit?screenId=" + screenId, blog)
  }

  public deleleBlog = (blogId: number, screenId: number): Observable<ResponseModel<null>> => {
    return this.http.delete<ResponseModel<null>>(`${this.apiUrl}/blogs/delete/${blogId}?` + `screenId=${screenId}`)
  }

  public approveBlog = (blogId: number, screenId: number): Observable<ResponseModel<BlogModel>> => {
    return this.http.put<ResponseModel<BlogModel>>(this.apiUrl + `/blogs/Approve/${blogId}?screenId=` + screenId, null)
  }

  public rateBlog = (blogId: number, rating: number): Observable<ResponseModel<null>> => {
    return this.http.put<ResponseModel<null>>(this.apiUrl + `/blogs/rate/${blogId}?rating=${rating}&screenId=${6}`, null)
  }

}

