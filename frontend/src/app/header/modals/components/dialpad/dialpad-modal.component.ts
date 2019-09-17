import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { VSModalComponent } from 'src/app/shared/modals/vs-modal/vs-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';
import { fadeAnimation } from '@app/shared/animations/fade.animation';
import { WebRTCService } from '@app/core/services/web-rtc/web-rtc.service';

@Component({
  selector: 'app-manual-dial-modal',
  templateUrl: './dialpad-modal.component.html',
  styleUrls: ['./dialpad-modal.component.scss'],
  animations: [fadeAnimation],
})
export class DialpadModalComponent extends VSModalComponent implements OnInit {
  @ViewChild(MatInput) input;

  constructor(
    dialogRef: MatDialogRef<VSModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private webRTCService: WebRTCService,
  ) {
    super(dialogRef, data);
  }

  ngOnInit() {}

  onDialpadClicked(e) {
    let target = e.target;
    const tag = target.tagName.toLowerCase();

    if (['button', 'span'].includes(tag)) {
      if (tag === 'button') {
        target = target.firstElementChild;
      } else {
        if (target.className !== 'mat-button-wrapper') {
          target = target.parentElement;
        }
      }

      const value = target.innerText.slice(0, 1);

      this.input.value = this.input.value + value;
      this.webRTCService.sendDTMF(value);
    }
  }
}
