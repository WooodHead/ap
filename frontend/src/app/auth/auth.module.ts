import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';

import { LoginPageComponent } from '@app/auth/containers/login-page.component';
import { LoginFormComponent } from '@app/auth/components/login-form/login-form.component';

import { AuthService } from '@app/auth/services/auth.service';
import { AuthGuard } from '@app/auth/services/auth.guard';

import { MaterialModule } from '@app/shared/material';
import { ComponentsModule } from '@app/shared/components';
import { AuthState } from '@app/auth/store/auth.state';
import { UserState } from '@app/auth/store/user.state';

export const COMPONENTS = [LoginPageComponent, LoginFormComponent];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    ComponentsModule,
    TranslateModule,
    NgxsFormPluginModule,
    NgxsModule.forFeature([
      AuthState,
      UserState,
    ]),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootAuthModule,
      providers: [AuthService, AuthGuard],
    };
  }
}

@NgModule({
  imports: [
    AuthModule,
    RouterModule.forChild([{ path: '', component: LoginPageComponent }]),
  ],
})
export class RootAuthModule {}
