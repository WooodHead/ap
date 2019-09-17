import { NotificatorService } from './notificator.service';
import { ComponentRef } from '@angular/core';
import { DomService } from './dom-service';
import { IframeComponent } from '@app/panel/components/iframe/iframe.component';
import { NotificatorConfig } from '@app/core/services/notificator/notificator-config.model';

export class IframeNotificatorService extends NotificatorService {
  private componentRef: ComponentRef<any>;

  constructor(config: NotificatorConfig, private domService: DomService) {
    super(config);
  }

  open(): void {
    if (this.componentRef) {
      this.domService.disposeComponent(this.componentRef);
    }
    this.componentRef = (
      this.domService.attachToBody(IframeComponent, { url: this.notificatorUrl })
    );
    window.resizeTo(window.screen.width, window.screen.height);
  }
}
