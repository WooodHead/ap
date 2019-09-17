import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Authenticate } from '@app/auth/models/authenticate.model';
import { fadeAnimation } from '@app/shared/animations/fade.animation';

@Component({
  selector: 'vs-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  animations: [fadeAnimation],
})
export class LoginFormComponent implements OnInit {
  @Input() loading: boolean;
  @Input() isWebrtc: boolean;
  @Input() isSmallScreen: boolean;

  @Input()
  set isLoggedIn(isLoggedIn: boolean) {
    this.loggedIn = isLoggedIn;

    if (isLoggedIn) {
      this.form.controls.agent.disable();
      this.form.controls.extension.disable();

      if (this.isWebrtc) {
        this.form.controls.secret.disable();
        this.form.controls.useWebRTC.disable();
      }
    } else {
      this.form.controls.agent.enable();
      this.form.controls.extension.enable();

      if (this.isWebrtc) {
        this.form.controls.secret.enable();
        this.form.controls.useWebRTC.enable();
      }
    }
  }

  @Input() errorMessage: string | null;
  @Input() formData: any;

  @Output() formInvalid = new EventEmitter();
  @Output() submitted = new EventEmitter<Authenticate>();
  @Output() openPanel = new EventEmitter();
  @Output() logout = new EventEmitter();

  loggedIn: boolean;

  form: FormGroup = this.fb.group({
    agent: ['', Validators.required],
    extension: ['', Validators.required],
    secret: ['', Validators.required],
    view: ['horizontal'],
    useWebRTC: [true],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (!this.isWebrtc) {
      this.form.removeControl('secret');
    }

    if (this.formData && this.formData.value) {
      if (!this.isWebrtc) {
        delete this.formData.value.secret;
      }

      if (!this.formData.value.useWebRTC) {
        this.form.get('secret').setValidators(null);
      }

      this.form.setValue(this.formData.value);
    }

    this.form.get('useWebRTC').valueChanges.subscribe((useWebRTC) => {
      if (useWebRTC) {
        this.form.get('secret').setValidators([Validators.required]);
      } else {
        this.form.get('secret').setValidators(null);
        this.form.get('secret').reset();
        this.form.get('secret').markAsPristine();
      }
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.formInvalid.emit('login.errors.required');
      return;
    }

    if (this.isSmallScreen) {
      this.form.value.view = 'vertical';
    }

    this.submitted.emit(this.form.value);
  }

  setFromRecentlyUsed(field, value) {
    this.form.controls[field].setValue(value);
  }

  onOpenPanel() {
    this.openPanel.emit(this.form.value.view);
  }

  onLogout() {
    this.logout.emit();
  }
}
