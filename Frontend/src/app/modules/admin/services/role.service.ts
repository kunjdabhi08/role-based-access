import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../../../common/models/Response.model';
import { Observable } from 'rxjs';
import { RoleModel } from '../models/role.model';
import { enviroment } from '../../../../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl = `${enviroment.API_URL}/role`

  constructor(private http: HttpClient) { }

  public getRoles = ():Observable<ResponseModel<RoleModel[]>> => {
    return this.http.get<ResponseModel<RoleModel[]>>(this.apiUrl + `?screenId=3`)
  }
}
