import { NotificatorService } from './notificator.service';
import { NotificatorConfig } from '@app/core/services/notificator/notificator-config.model';

export class NotificatorWindowService extends NotificatorService {
  constructor(config: NotificatorConfig) {
    super(config);
  }
  open(): void {
    window.open(this.url);
  }
}
