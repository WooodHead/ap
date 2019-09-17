import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from '@app/shared/material';
import { ComponentsModule } from '@app/shared/components';
import { TranslateModule } from '@ngx-translate/core';

import { NgxsModule } from '@ngxs/store';

import {
  HeaderComponent,
  LogoComponent,
} from '@app/header/components';

import { CallCenterModule } from '@app/header/call-center/call-center.module';
import { DialerModule } from '@dialer/dialer.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderModalsModule } from '@app/header/modals/header-modals.module';
import { WebRTCState } from '@app/header/store/webrtc.state';

import { ModalsModule } from '@app/shared/modals';

export const COMPONENTS = [
  HeaderComponent,
  LogoComponent,
];

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    ComponentsModule,
    TranslateModule,
    ModalsModule,
    HeaderModalsModule,
    DialerModule,
    CallCenterModule,
    NgxsModule.forFeature([
      WebRTCState,
    ]),
  ],
  providers: [],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class HeaderModule { }
