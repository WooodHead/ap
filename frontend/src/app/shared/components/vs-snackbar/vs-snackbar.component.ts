import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';

@Component({
  selector: 'vs-snackbar',
  templateUrl: './vs-snackbar.component.html',
  styleUrls: ['./vs-snackbar.component.scss'],
})
export class VSSnackBarComponent {
  constructor(
    private snackBarRef: MatSnackBarRef<VSSnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
  ) {}

  close() {
    this.snackBarRef.dismiss();
  }
}
