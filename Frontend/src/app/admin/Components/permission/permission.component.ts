import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccessService } from '../../Services/access.service';
import { AccessModel } from '../../Models/access.model';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AuthServiceService } from '../../../auth/Services/Auth/auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, RouterLink],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.css'
})
export class PermissionComponent {
  permissions: AccessModel[]
  id: number;
  allPermission: boolean[];
  isEdited: boolean[];
  permission: AccessModel;

  
  constructor(private route: ActivatedRoute, private accessService: AccessService, private authService: AuthServiceService, private snackbar: MatSnackBar) {
    this.id = Number(this.route.snapshot.paramMap.get('id'))
    this.permission = this.authService.getPermission(3);
    this.fetchPermission()
  }

  fetchPermission = ():void => {
    this.accessService.getAccessByRole(this.id).subscribe({
      next: (data) => {
        this.permissions = data.data;
        this.allPermission = data.data.map((p)=> {
          return p.accesses.every(p=> p === true)
        })
        this.isEdited = this.permissions.map((p, i) => false)
        
      },  
      error: (err) => {
        alert(err.error.message)
      }
    })
  } 

  public checkAll = (checked: boolean, index: number): void => {
    this.isEdited[index] = true;
    if(checked){
      this.permissions[index].accesses.fill(true);
    } else {
      this.permissions[index].accesses.fill(false);
    }
  }

  public handleChange = (checked: boolean, index: number, indexOfPermission: number): void => {
    this.isEdited[index] = true;
    if(checked){
      this.permissions[index].accesses[indexOfPermission] = true;
      this.allPermission[index] = this.permissions[index].accesses.every(p => p === true);
    } else {
      this.allPermission[index] = false;
      this.permissions[index].accesses[indexOfPermission] = false;
    }
  }

  public savePermission = (index: number) => {
    if(!this.permission.accesses[1]){
      this.snackbar.open("You don't have permission", "Ok" , {
        verticalPosition: "top",
        horizontalPosition:"end"
      })
      return;
    }
    this.accessService.editAccess(this.permissions[index]).subscribe({
      next: (data)=>{
        console.log("Edited successfully");
        this.isEdited[index] = false;
      },
      error: (err) => {
        alert(err.error.message);
      }
    })
  }

}
