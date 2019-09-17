import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';

import { UserState } from '@app/auth/store/user.state';
import { AuthState } from '@app/auth/store/auth.state';
import { Login, LoginFailure, Logout, ForceLogin } from '@app/auth/store/auth.actions';
import { OpenPanel, ShowError } from '@app/panel/store/panel.actions';
import { LoginForm } from '@app/auth/models/login-form.model';
import { ViewType } from '@app/core/services/window/view.type';
import { filter } from 'rxjs/operators';
import { ModalService } from '@app/shared/modals';
import { ConfigService } from '@app/core/services/config/config.service';
import { LayoutState } from '@app/core/store/layout.state';

@Component({
  selector: 'vs-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit {
  @Select(AuthState.getLoading) loading$;
  @Select(AuthState.getError) error$;
  @Select(AuthState.getForm) form$;
  @Select(UserState.getLoggedIn) isLoggedIn$;
  @Select(LayoutState.getIsSmallScreen) isSmallScreen$;

  constructor(
    private store: Store,
    private modalService: ModalService,
    public config: ConfigService,
  ) {}

  ngOnInit() {
    this.error$
    .pipe(filter(err => !!err))
    .subscribe((error) => {
      switch (error.message) {
        case 'login.errors.agent-extension-online':
          this.modalService
            .openConfirm('login')
            .pipe(filter(confirmed => confirmed))
            .subscribe(() => this.store.dispatch(new ForceLogin()));
          break;

        default:
          this.store.dispatch(new ShowError(error));
      }
    });
  }

  onSubmit(form: LoginForm) {
    this.store.dispatch(new Login(form));
  }

  onFormInvalid(message) {
    this.store.dispatch(new LoginFailure({ message }));
  }

  onLogout() {
    this.store.dispatch(new Logout());
  }

  onOpenPanel(view: ViewType) {
    this.store.dispatch(new OpenPanel(view));
  }
}
