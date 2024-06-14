import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfimartionDialogComponent } from '../confimartion-dialog/confimartion-dialog.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forbidden-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './forbidden-dialog.component.html',
  styleUrl: './forbidden-dialog.component.css'
})

export class ForbiddenDialogComponent {

  isBack: boolean;

  constructor(
    public dialogRef: MatDialogRef<ConfimartionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private location: Location
  ) {
    if (data.isBack) {
      this.isBack = data.isBack;
    }
  }

  public handleBack =() => {
    this.location.back();
  }
}
