import { TestBed, async } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';

import { Login, LoginSuccess, LogoutSuccess } from '@app/auth/store/auth.actions';
import { AuthService } from '@app/auth/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthState } from '@app/auth/store/auth.state';
import { MaterialModule } from '@app/shared/material';
import { LoginForm } from '@app/auth/models/login-form.model';
import { Agent } from '@app/auth/models/agent.model';
import { ModalService } from '@app/shared/modals';

describe('Auth State', () => {
  let store: Store;

  const agentData: Agent = {
    agent: 1,
    extension: 2,
    username: 'test',
  };

  const formData: LoginForm = {
    agent: 1,
    extension: 2,
    view: 'horizontal',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MaterialModule,
        NgxsModule.forRoot([AuthState]),
      ],
      providers: [
        AuthService,
        ModalService,
      ],
    });

    store = TestBed.get(Store);
    // store.reset({});
  }));

  it('show loading', async(() => {
    store.dispatch(new Login(formData));
    store
      .selectOnce(state => state.auth.loading)
      .subscribe((loading) => {
        expect(loading).toBe(true);
      });
  }));

  it('remember form', async(() => {
    store.dispatch(new Login(formData));

    store
      .selectOnce(state => state.auth.form)
      .subscribe((form) => {
        expect(form).toBe(form);
      });
  }));

  it('store recently used', async(() => {
    const newFormData = {
      agent: 3,
      extension: 4,
      view: 'horizontal',
    };

    store.dispatch(new LoginSuccess(agentData, formData)); // login with a.1 ext.2
    store.dispatch(new LoginSuccess(agentData, newFormData)); // login with a.3 ext.4

    const expected = {
      agent: [3, 1],
      extension: [4, 2],
    };

    store
      .selectOnce(state => state.auth.form)
      .subscribe((form) => {
        expect(form.recentlyUsed).toEqual(expected);
      });
  }));

  it('reset form', async(() => {
    store.dispatch(new Login(formData)); // login with a.1 ext.2
    store.dispatch(new LogoutSuccess());

    store
      .selectOnce(state => state.auth.form)
      .subscribe((form) => {
        expect(form.value).toBe(null);
      });
  }));
});
