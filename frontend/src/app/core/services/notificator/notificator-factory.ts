import { HttpService } from '@app/core/services/http/http.service';
import { ConfigService } from '@app/core/services/config/config.service';
import { DomService } from '@app/core/services/notificator/dom-service';
import { NotificatorWebService } from '@app/core/services/notificator/notificator-web.service';
import {
  IframeNotificatorService,
} from '@app/core/services/notificator/iframe-notificator.service';
import {
   NotificatorWindowService,
} from '@app/core/services/notificator/notificator-window.service';

export function createNotificatorFactory(
  config: ConfigService, http: HttpService, domService: DomService,
) {
  const { action, crmView } = config.notificator;

  if (action === 'webService') {
    return new NotificatorWebService(config.notificator, http);
  }

  if (action === 'windowBrowser') {
    if (crmView === 'thisWindow') {
      return new IframeNotificatorService(config.notificator, domService);
    }
    return new NotificatorWindowService(config.notificator);
  }
}
