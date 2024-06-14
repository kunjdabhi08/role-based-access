import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confimartion-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confimartion-dialog.component.html',
  styleUrl: './confimartion-dialog.component.css'
})

export class ConfimartionDialogComponent {

  message: string = "Are you sure want to delete?"
  isSubscribe: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ConfimartionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.message) {
      this.message = data.message;
      this.isSubscribe = true;
    }
  }

  public onConfirm = (): void => {
    this.dialogRef.close(true);
  }
}
