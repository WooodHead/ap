import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { noop } from 'rxjs';

import { NgxsModule } from '@ngxs/store';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { AuthModule } from '@app/auth/auth.module';

import { environment } from '@env/environment';
import { AppComponent } from '@app/app.component';
import { NotFoundPageComponent } from '@app/not-found-page/not-found-page.component';
import { routes } from '@app/app.routes';
import { ComponentsModule } from '@app/shared/components';
import { VSTranslateModule } from '@app/shared/translate/vs-translate.module';
import { MaterialModule } from '@app/shared/material';
import { ActionsHandler } from '@app/core/services/actions.handler';
import {
  CheckSessionService,
  checkSessionInitializer,
} from '@app/core/services/check-session.service';
import {
  configInitializer,
  ConfigService,
} from '@app/core/services/config/config.service';
import { RequestInterceptor } from '@app/core/services/request.interceptor';
import { PanelModule } from '@app/panel/panel.module';
import { PanelState } from '@app/panel/store/panel.state';
import { LayoutState } from '@app/core/store/layout.state';
import { HttpService } from '@app/core/services/http/http.service';
import { NotificatorModule } from '@app/core/services/notificator/notificator.module';
import { allKeys } from '@app/shared/constants/local-storage.constants';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,

    MaterialModule,
    ComponentsModule,

    RouterModule.forRoot(routes, { useHash: true }),

    NgxsModule.forRoot([LayoutState, PanelState]),
    NgxsRouterPluginModule.forRoot(),
    NgxsFormPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production }),
    // NgxsLoggerPluginModule.forRoot({
    //   disabled: environment.production,
    //   logger: console,
    //   collapsed: true,
    // }),

    NgxsStoragePluginModule.forRoot({
      key: allKeys,
    }),

    AuthModule.forRoot(),
    PanelModule,
    VSTranslateModule,
    NotificatorModule.forRoot([ConfigService, HttpService]),
  ],
  providers: [
    ActionsHandler,
    {
      provide: APP_INITIALIZER,
      useFactory: () => noop,
      deps: [ActionsHandler],
      multi: true,
    },
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configInitializer,
      deps: [ConfigService],
      multi: true,
    },
    CheckSessionService,
    {
      provide: APP_INITIALIZER,
      useFactory: checkSessionInitializer,
      deps: [CheckSessionService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
