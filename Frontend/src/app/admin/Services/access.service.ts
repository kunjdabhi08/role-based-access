import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccessModel } from '../Models/access.model';
import { ResponseModel } from '../../Models/Response.model';
import { Observable } from 'rxjs';
import { PermissionModel } from '../Models/permission.model';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  constructor(private http: HttpClient) { }

  private apiUrl = "https://localhost:7270/api/access"

  public getAccess = ():Observable<ResponseModel<AccessModel[]>> => {
    return this.http.get<ResponseModel<AccessModel[]>>(this.apiUrl + `?screenId=3`)
  }

  public getAccessByRole = (roleId: number):Observable<ResponseModel<AccessModel[]>> => {
    return this.http.get<ResponseModel<AccessModel[]>>(this.apiUrl + `/${roleId}` + `?screenId=3`)
  }

  public editAccess = (model: AccessModel[]): Observable<ResponseModel<AccessModel>> => {
    return this.http.put<ResponseModel<AccessModel>>(this.apiUrl + `?screenId=3`, model)
  }

  public getByScreen = (roleid:number, screenid:number):Observable<ResponseModel<PermissionModel>> => {
    return this.http.get<ResponseModel<PermissionModel>>(this.apiUrl+ `/${roleid}/${screenid}`)
  }
 
}
