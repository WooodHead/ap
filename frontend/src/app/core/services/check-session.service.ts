import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserState } from '@app/auth/store/user.state';
import { LogoutSuccess } from '@app/auth/store/auth.actions';
import { SnackBarService } from '@app/shared/components/vs-snackbar/snackbar.service';
import { PanelState } from '@app/panel/store/panel.state';
import { combineLatest, timer } from 'rxjs';
import { HttpService } from '@app/core/services/http/http.service';

@Injectable()
export class CheckSessionService {

  constructor(
    private httpService: HttpService,
    private snackBarService: SnackBarService,
    private store: Store,
  ) {}

  check() {
    if (window.location.hash.match(/panel/i)) {
      return;
    }

    let timerSubscription;

    // FIXME discuss login flow
    combineLatest(
      this.store.select(UserState.getLoggedIn),
      this.store.select(PanelState.getOpened),
    )
      .subscribe(([isLoggedIn, isPanelOpened]) => {
        if (isLoggedIn && !isPanelOpened) {
          // create check-session requests each 3 seconds
          timerSubscription = timer(0, 3000).subscribe(() => {
            this.httpService
              .get('check-session')
              .subscribe((session) => {
                // user was logged out
                if (!session) {
                  this.store.dispatch(new LogoutSuccess());

                  this.snackBarService.open({
                    message: 'login.external-logout-message',
                    action: 'OK',
                  });
                }
              });
          });
        } else {
          if (timerSubscription) {
            timerSubscription.unsubscribe();
          }
        }
      });
  }
}

export function checkSessionInitializer(checkSessionService: CheckSessionService) {
  return () => checkSessionService.check();
}
