import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccessModel } from '../Models/access.model';
import { ResponseModel } from '../../Models/Response.model';
import { Observable } from 'rxjs';
import { User } from '../../auth/Models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) { }

  private apiUrl = "https://localhost:7270/api/user"

  
  public getUsers = ():Observable<ResponseModel<User[]>> => {
    return this.http.get<ResponseModel<User[]>>(this.apiUrl + `?screenId=3`)
  }

  public deleteUser = (id: number, screenId: number): Observable<ResponseModel<null>> => {
    return this.http.delete<ResponseModel<null>>(this.apiUrl + `/${id}?screenId=${screenId}`)
  }

  public subscribeUser = (id: number, subscribe: number): Observable<ResponseModel<null>> => {
    return this.http.post<ResponseModel<null>>(this.apiUrl + `/${id}?subscribe=${subscribe}&screenId=1`, null);
  }
}
