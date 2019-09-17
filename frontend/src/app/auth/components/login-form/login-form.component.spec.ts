import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginFormComponent } from '@app/auth/components/login-form/login-form.component';
import { ComponentsModule } from '@app/shared/components';
import { AUTH_INITIAL_STATE } from '@app/auth/store/auth.state';
import { MaterialModule } from '@app/shared/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VSTranslateModule } from '@app/shared/translate/vs-translate.module';

describe('Login Form', () => {
  let fixture: ComponentFixture<LoginFormComponent>;
  let component: LoginFormComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        VSTranslateModule,
        MaterialModule,
        ComponentsModule,
      ],
      declarations: [LoginFormComponent],
    });

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;

    component.formData = AUTH_INITIAL_STATE.form;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner if loading', () => {
    component.loading = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('vs-spinner')).toBeTruthy();
  });

  it('should emit error if form invalid', () => {
    spyOn(component.formInvalid, 'emit');

    component.form.setErrors({ invalid: true });
    component.onSubmit();

    expect(component.formInvalid.emit).toHaveBeenCalled();
  });

  it('should emit an event if the form is valid when submitted', () => {
    const formData = {
      agent: 'user',
      extension: 'pass',
      view: 'horizontal',
    };

    spyOn(component.submitted, 'emit');

    component.form.setValue(formData);
    component.onSubmit();

    expect(component.submitted.emit).toHaveBeenCalledWith(formData);
  });
});
