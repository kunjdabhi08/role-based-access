import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseModel } from '../../../Models/Response.model';
import { User } from '../../Models/user.model';
import { Router } from '@angular/router';
import { AccessModel } from '../../../admin/Models/access.model';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private apiUrl = 'https://localhost:7270/api/auth'

  public isAuth = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  public isLoggedIn = (): boolean => {
    var token = localStorage.getItem('token');
    var user = localStorage.getItem('user');
    if (user && token) {
      return true;
    }
    return false;
  }

  public getPermission = (screenId: number): AccessModel => {
    var permissions = JSON.parse(localStorage.getItem('permission'));
    for (let i = 0; i < permissions.length; i++) {
      if (permissions[i].screenId === screenId) {
        return permissions[i];
      }
    }
    return null;

  }

  public autoLogin = (): void => {
    var token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(["blog/blogs"]);
      this.isAuth.next(true);
    }
  }


  public login = (email: string, password: string): Observable<ResponseModel<User>> => {
    return this.http.get<ResponseModel<User>>(`${this.apiUrl}?email=${email}&password=${password}`)
  }

  public register = (model: User): Observable<ResponseModel<User>> => {
    return this.http.post<ResponseModel<User>>(this.apiUrl, model)
  }



} 
