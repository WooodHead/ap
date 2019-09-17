import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserState } from '@app/auth/store/user.state';
import { LoginRedirect } from '@app/auth/store/auth.actions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(): Observable<boolean> {
    return this.store
      .selectOnce(UserState.getLoggedIn)
      .pipe(
        map((isLoggedIn) => {
          if (!isLoggedIn) {
            this.store.dispatch(new LoginRedirect());
            return false;
          }

          return true;
        }),
      );
  }
}
