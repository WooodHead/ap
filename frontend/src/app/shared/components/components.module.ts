import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from '@app/shared/material';

import {
  VSButtonComponent,
  VSFabButtonComponent,
  VSMiniFabButtonComponent,
  VSIconButtonComponent,
} from '@app/shared/components/vs-buttons';

import { VSImageComponent } from '@app/shared/components/vs-image/vs-image.component';
import { VSMenuComponent } from '@app/shared/components/vs-menu/vs-menu.component';
import { VSIconComponent } from '@app/shared/components/vs-icon/vs-icon.component';
import { VSCheckboxComponent } from '@app/shared/components/vs-checkbox/vs-checkbox.component';
import {
  VSCheckboxListComponent,
} from '@app/shared/components/vs-checkbox-list/vs-checkbox-list.component';
import {
  VSRadioGroupComponent,
} from '@app/shared/components/vs-radio-group/vs-radio-group.component';
import { SnackBarService } from '@app/shared/components/vs-snackbar/snackbar.service';
import { VSSnackBarComponent } from '@app/shared/components/vs-snackbar/vs-snackbar.component';
import {
  VSRecentlyUsedComponent,
} from '@app/shared/components/vs-recently-used/vs-recently-used.component';
import {
  VSSnackBarRateComponent,
} from '@app/shared/components/vs-snackbar-rate/vs-snackbar-rate.component';
import { SnackBarRateService } from '@app/shared/components/vs-snackbar-rate/snackbar-rate.service';
import { VSSpinnerComponent } from '@app/shared/components/vs-spinner/vs-spinner.component';
import { CrmButtonComponent } from '@app/shared/components/crm-button/crm-button.component';

const COMPONENTS = [
  VSButtonComponent,
  VSFabButtonComponent,
  VSMiniFabButtonComponent,
  VSIconButtonComponent,
  VSImageComponent,
  VSMenuComponent,
  VSIconComponent,
  VSCheckboxComponent,
  VSCheckboxListComponent,
  VSRadioGroupComponent,
  VSSnackBarComponent,
  VSSnackBarRateComponent,
  VSRecentlyUsedComponent,
  VSSpinnerComponent,
  CrmButtonComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    TranslateModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [
    SnackBarService,
    SnackBarRateService,
  ],
  entryComponents: [
    VSSnackBarComponent,
    VSSnackBarRateComponent,
  ],
})
export class ComponentsModule {}
