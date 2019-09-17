import { HttpService } from '@app/core/services/http/http.service';
import { NotificatorService } from './notificator.service';
import { NotificatorConfig } from '@app/core/services/notificator/notificator-config.model';

export class NotificatorWebService extends NotificatorService {
  constructor(config: NotificatorConfig, private http: HttpService) {
    super(config);
  }

  open(): void {
    this.http
      .get(this.url, { usePrefix: false })
      .subscribe();
  }
}
