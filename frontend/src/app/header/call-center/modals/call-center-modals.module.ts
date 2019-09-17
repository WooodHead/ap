import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalsModule } from '@app/shared/modals';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@app/shared/components';
import { MaterialModule } from '@app/shared/material';
import { DialerCampaignModalComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ModalsModule,
    TranslateModule,
    ComponentsModule,
  ],
  declarations: [DialerCampaignModalComponent],
  entryComponents: [DialerCampaignModalComponent],
  exports: [DialerCampaignModalComponent],
})
export class CallCenterModalsModule {}
