import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';

import { MaterialModule } from '@app/shared/material';
import { ComponentsModule } from '@app/shared/components';
import { DialerActionsComponent } from '@dialer/components/dialer-actions.component';
import { DialerState } from '@dialer/store/dialer.state';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialerCampaignState } from '@dialer/store/dialer-campaigns.state';
import { DialerSessionDataInterceptor } from '@dialer/services/dialer-session-data.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DialerRedialState } from '@dialer/store/dialer-redial.state';
import { DialerCallbacksState } from '@dialer/store/dialer-callbacks.state';
import { DialerStatusState } from '@dialer/store/dialer-statuses.state';
import { DialerModalsModule } from '@dialer/modals';
import { ModalsModule } from '@app/shared/modals';

export const COMPONENTS = [DialerActionsComponent];

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    ComponentsModule,
    TranslateModule,
    ModalsModule,
    DialerModalsModule,
    NgxsFormPluginModule,
    NgxsModule.forFeature([
      DialerState,
      DialerCampaignState,
      DialerRedialState,
      DialerCallbacksState,
      DialerStatusState,
    ]),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DialerSessionDataInterceptor,
      multi: true,
    },
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class DialerModule {}
