import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';

import { MaterialModule } from '@app/shared/material';
import { ComponentsModule } from '@app/shared/components';
import {
  CallCenterActionsComponent,
} from '@call-center/components/call-center-actions.component';
import { CallCenterState } from '@call-center/store/call-center.state';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalsModule } from '@app/shared/modals';
import { CallCenterModalsModule } from '@call-center/modals';
import { WebRTCActionsComponent } from '@app/header/components';

export const COMPONENTS = [
  CallCenterActionsComponent,
  WebRTCActionsComponent,
];

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    ComponentsModule,
    TranslateModule,
    ModalsModule,
    CallCenterModalsModule,
    NgxsFormPluginModule,
    NgxsModule.forFeature([CallCenterState]),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class CallCenterModule {}
