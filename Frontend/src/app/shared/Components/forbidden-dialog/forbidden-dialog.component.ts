import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

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
  
}
