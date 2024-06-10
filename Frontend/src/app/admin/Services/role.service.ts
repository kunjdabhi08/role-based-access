import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../../Models/Response.model';
import { Observable } from 'rxjs';
import { RoleModel } from '../Models/role.model';


@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = "https://localhost:7270/api/role"
  constructor(private http: HttpClient) { }

  public getRoles = ():Observable<ResponseModel<RoleModel[]>> => {
    return this.http.get<ResponseModel<RoleModel[]>>(this.apiUrl + `?screenId=3`)
  }
}
