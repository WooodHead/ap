import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/shared/material';
import { ModalService } from './services/modal.service';
import { VSModalComponent } from './vs-modal/vs-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@app/shared/components';

const modals = [];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    ComponentsModule,
  ],
  providers: [
    ModalService,
  ],
  declarations: [VSModalComponent],
  exports: [VSModalComponent],
  entryComponents: [VSModalComponent],
})
export class ModalsModule {}
