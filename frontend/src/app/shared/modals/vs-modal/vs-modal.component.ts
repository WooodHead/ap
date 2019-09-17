import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'vs-modal',
  templateUrl: 'vs-modal.component.html',
  styleUrls: ['vs-modal.component.scss'],
})
export class VSModalComponent {
  constructor(
    private dialogRef: MatDialogRef<VSModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  close(data?): void {
    this.dialogRef.close(data);
  }
}
