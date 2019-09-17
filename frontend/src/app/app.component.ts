import { Component, HostBinding } from '@angular/core';
import { Store } from '@ngxs/store';
import { fadeInAnimation } from '@app/shared/animations/fade-in.animation';
import { ConfigService } from '@app/core/services/config/config.service';
import { TranslateService } from '@ngx-translate/core';
import { ChangeFormView } from '@app/auth/store/auth.actions';
import { PanelSetFromStorage } from '@app/panel/store/panel.actions';
import { DialerSetFromStorage } from '@dialer/store/dialer.actions';
import { dialerKeys, panelKeys, panelView } from '@app/shared/constants/local-storage.constants';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  animations: [fadeInAnimation],
})
export class AppComponent {
  @HostBinding('@fadeIn') routeAnimation = true;

  constructor(
    config: ConfigService,
    translate: TranslateService,
    store: Store,
  ) {
    // listen to panel events and update auth page state accordingly
    const fromPanelEvents = panelKeys;
    const fromDialerEvents = dialerKeys;

    const onStorage = (event) => {
      if (window.location.hash === '#/') {
        if (fromPanelEvents.includes(event.key)) {
          const key = event.key.split('.').pop();
          const value = JSON.parse(event.newValue);

          store.dispatch(new PanelSetFromStorage({ key, value }));

          if (event.key === panelView) {
            store.dispatch(new ChangeFormView(value));
          }
        }

        if (fromDialerEvents.includes(event.key)) {
          const key = event.key.split('.').slice(1).join('.');
          const value = JSON.parse(event.newValue);

          store.dispatch(new DialerSetFromStorage({ key, value }));
        }
      }
    };

    if (window.addEventListener) {
      window.addEventListener('storage', onStorage, false);
    } else {
      (<any>window).attachEvent('onstorage', onStorage);
    }

    translate.setDefaultLang(config.language);
  }
}
