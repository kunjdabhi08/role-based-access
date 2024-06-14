import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseModel } from '../../../Models/Response.model';
import { User } from '../../Models/user.model';
import { Router } from '@angular/router';
import { AccessModel } from '../../../admin/Models/access.model';
import { CommonService } from '../../../shared/Services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private apiUrl = 'https://localhost:7270/api/auth'

  public isAuth: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient, 
    private router: Router,
    private commonService: CommonService
  ) {}

  get loggedIn(){
    return this.isAuth.asObservable();
  }

  public getUser(){
    var user: User = JSON.parse(this.commonService.decrypt(sessionStorage.getItem('user')));
    return user;
  }

  public isLoggedIn = (): boolean => {
    var token = sessionStorage.getItem('token');
    var user = sessionStorage.getItem('user');
    if (user && token) {
      return true;
    }
    return false;
  }



  public autoLogin = (): void => {
    var token = sessionStorage.getItem('token');
    if (token) {
      this.isAuth.next(true);
      this.router.navigate(["blog/blogs"]);
    }
  }


  public login = (email: string, password: string): Observable<ResponseModel<User>> => {
    return this.http.get<ResponseModel<User>>(`${this.apiUrl}?email=${email}&password=${password}`)
  }

  public register = (model: User): Observable<ResponseModel<User>> => {
    return this.http.post<ResponseModel<User>>(this.apiUrl, model)
  }

} 
