import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule, Store } from '@ngxs/store';

import { LoginPageComponent } from '@app/auth/containers/login-page.component';
import { LoginFormComponent } from '@app/auth/components/login-form/login-form.component';

import { MaterialModule } from '@app/shared/material';
import { ComponentsModule } from '@app/shared/components';

import { UserState } from '@app/auth/store/user.state';
import { Login, LoginFailure } from '@app/auth/store/auth.actions';
import { AuthService } from '@app/auth/services/auth.service';
import { AuthGuard } from '@app/auth/services/auth.guard';
import { VSTranslateModule } from '@app/shared/translate/vs-translate.module';

describe('Login Page', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let store: Store;
  let component: LoginPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        VSTranslateModule,
        NgxsModule.forRoot([UserState]),
        MaterialModule,
        ComponentsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        AuthService,
        AuthGuard,
      ],
      declarations: [LoginPageComponent, LoginFormComponent],
    });

    store = TestBed.get(Store);

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should dispatch a login failure event on form invalid', () => {
    const $event: any = {};
    const action = new LoginFailure($event);

    spyOn(store, 'dispatch').and.callThrough();

    component.onSubmit($event);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch a login event on submit', () => {
    const $event: any = {};
    const action = new Login($event);

    spyOn(store, 'dispatch').and.callThrough();

    component.onSubmit($event);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
