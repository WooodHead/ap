import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VSModalComponent } from '@app/shared/modals/vs-modal/vs-modal.component';

@Component({
  selector: 'app-disconnect-modal',
  templateUrl: './disconnect-modal.component.html',
  styleUrls: ['./disconnect-modal.component.scss'],
})
export class DisconnectModalComponent extends VSModalComponent implements OnInit {

  constructor(
    dialogRef: MatDialogRef<VSModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    super(dialogRef, data);
  }

  ngOnInit() {
  }

}
