import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { VSModalComponent } from 'src/app/shared/modals/vs-modal/vs-modal.component';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';
import { fadeAnimation } from '@app/shared/animations/fade.animation';

@Component({
  selector: 'app-manual-dial-modal',
  templateUrl: './manual-dial-modal.component.html',
  styleUrls: ['./manual-dial-modal.component.scss'],
  animations: [fadeAnimation],
})
export class ManualDialModalComponent extends VSModalComponent implements OnInit {
  @ViewChild(MatInput) input;

  submitted = false;
  form: FormGroup = this.fb.group({
    phoneNumber: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern('^[0-9()+\\-*#\\s]+$'),
    ]],
  });

  constructor(
    private fb: FormBuilder,
    dialogRef: MatDialogRef<VSModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    super(dialogRef, data);
  }

  ngOnInit() {
    this.input.focus();
  }

  onSubmit() {
    this.submitted = true;
    if (!this.form.valid) {
      return;
    }

    const phoneNumber = this.form.value.phoneNumber.replace(/[\(\)\+\-\s]/g, '');

    this.close({ phoneNumber });
  }
}
