import { TestBed, async } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';

import { UserState } from '@app/auth/store/user.state';
import { LoginSuccess } from '@app/auth/store/auth.actions';
import { AuthService } from '@app/auth/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Auth', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState]),
      ],
      providers: [AuthService],
    });

    store = TestBed.get(Store);
    store.reset({});
  });

  it('login and store agent', async(() => {
    const agentData = {
      agent: 1,
      extension: 1,
      username: 'test',
    };

    store.dispatch(new LoginSuccess(agentData, {}));

    store
      .selectOnce(state => state.user)
      .subscribe((user) => {
        expect(user.agent).toBe(agentData);
        expect(user.isLoggedIn).toBe(true);
      });
  }));
});
