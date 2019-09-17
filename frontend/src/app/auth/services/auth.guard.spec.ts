import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { cold } from 'jasmine-marbles';
import { AuthGuard } from '@app/auth/services/auth.guard';
import { UserState } from '@app/auth/store/user.state';
import { LoginSuccess } from '@app/auth/store/auth.actions';
import { AuthService } from '@app/auth/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Auth Guard', () => {
  let guard: AuthGuard;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([UserState]),
      ],
      providers: [AuthService, AuthGuard],
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    guard = TestBed.get(AuthGuard);
  });

  it('should return false if the user state is not logged in', () => {
    const expected = cold('(a|)', { a: false });

    expect(guard.canActivate()).toBeObservable(expected);
  });

  it('should return true if the user state is logged in', () => {
    const agent: any = {};
    const action = new LoginSuccess(agent, {});
    store.dispatch(action);

    const expected = cold('(a|)', { a: true });

    expect(guard.canActivate()).toBeObservable(expected);
  });
});
