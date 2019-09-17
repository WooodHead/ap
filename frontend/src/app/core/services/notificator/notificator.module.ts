import { NgModule, ModuleWithProviders } from '@angular/core';
import { NotificatorService } from './notificator.service';
import { createNotificatorFactory } from '@app/core/services/notificator/notificator-factory';
import { DomService } from './dom-service';

@NgModule()
export class NotificatorModule {
  static forRoot(deps): ModuleWithProviders {
    return {
      ngModule: NotificatorModule,
      providers: [
        DomService,
        {
          provide: NotificatorService,
          useFactory: createNotificatorFactory,
          deps: [...deps, DomService],
        },
      ],
    };
  }
}
