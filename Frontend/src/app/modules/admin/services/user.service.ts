import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../../../common/models/Response.model';
import { Observable } from 'rxjs';
import { User } from '../../auth/models/user.model';
import { enviroment } from '../../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private apiUrl = `${enviroment.API_URL}/user`

  constructor(private http: HttpClient) { }


  public getUsers = ():Observable<ResponseModel<User[]>> => {
    return this.http.get<ResponseModel<User[]>>(this.apiUrl + `?screenId=4`)
  }

  public deleteUser = (id: number, screenId: number): Observable<ResponseModel<null>> => {
    return this.http.delete<ResponseModel<null>>(this.apiUrl + `/${id}?screenId=${screenId}`)
  }

  public subscribeUser = (id: number, subscribe: number): Observable<ResponseModel<null>> => {
    return this.http.post<ResponseModel<null>>(this.apiUrl + `/${id}?subscribe=${subscribe}&screenId=1`, null);
  }
}
