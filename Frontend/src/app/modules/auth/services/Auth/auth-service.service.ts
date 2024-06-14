import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseModel } from '../../../../common/models/Response.model';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { CommonService } from '../../../../common/services/common.service';
import { enviroment } from '../../../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private apiUrl = `${enviroment.API_URL}/auth`

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
