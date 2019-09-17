import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from '@app/shared/material';
import { ComponentsModule } from '@app/shared/components';
import { TranslateModule } from '@ngx-translate/core';

import { NgxsModule } from '@ngxs/store';

import { AgentPanelPageComponent } from '@app/panel/containers/agent-panel-page.component';
import { TableState } from '@app/panel/store/table.state';
import {
  PanelTileListComponent,
} from '@app/panel/components/panel-tile-list/panel-tile-list.component';
import { PanelTileComponent } from '@app/panel/components/panel-tile/panel-tile.component';
import { routes } from '@app/panel/panel.routes';

import { InitialValuePipe } from '@app/panel/components/panel-tile/pipes/initial-value.pipe';
// import { DurationPipe } from '@app/panel/components/panel-tile/pipes/duration.pipe';

import { IframeComponent } from '@app/panel/components/iframe/iframe.component';
import { TransformDataService } from '@app/panel/services/transform-data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  PanelTileEditableComponent,
} from './components/panel-tile-editable/panel-tile-editable.component';
import { HeaderModule } from '@app/header/header.module';
import { ApplicationPipesModule } from '@app/shared/pipes/application-pipes.module';

export const COMPONENTS = [
  AgentPanelPageComponent,
  PanelTileListComponent,
  PanelTileComponent,
  IframeComponent,
  PanelTileEditableComponent,
];

export const PIPES = [
  InitialValuePipe,
//  DurationPipe,
];

@NgModule({
  imports: [
    ApplicationPipesModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    ComponentsModule,
    TranslateModule,
    HeaderModule,

    RouterModule.forChild(routes),
    NgxsModule.forFeature([
      TableState,
    ]),
  ],
  providers: [
    TransformDataService,
  ],
  declarations: [...COMPONENTS, ...PIPES],
  entryComponents: [IframeComponent],
})
export class PanelModule { }
