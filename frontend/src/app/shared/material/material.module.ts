import { NgModule } from '@angular/core';

import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatCheckboxModule,
  MatRadioModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatToolbarModule,
  MatDividerModule,
  ErrorStateMatcher,
  MatTooltipModule,
  MatSelectModule,
  MatMenuModule,
  MatDialogModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatBadgeModule,
} from '@angular/material';

import { OnlySubmittedErrorStateMatcher } from '@app/shared/material/material.error-state-matcher';

const modules = [
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatCheckboxModule,
  MatRadioModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatToolbarModule,
  MatTooltipModule,
  MatSelectModule,
  MatMenuModule,
  MatDividerModule,
  MatDialogModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatBadgeModule,
];

@NgModule({
  imports: modules,
  providers: [{ provide: ErrorStateMatcher, useClass: OnlySubmittedErrorStateMatcher }],
  exports: modules,
})
export class MaterialModule {}
