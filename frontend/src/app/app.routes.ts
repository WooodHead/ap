import { Routes } from '@angular/router';
import { AuthGuard } from '@app/auth/services/auth.guard';
import { NotFoundPageComponent } from '@app/not-found-page/not-found-page.component';
import { AgentPanelPageComponent } from '@app/panel/containers/agent-panel-page.component';

export const routes: Routes = [
  {
    path: 'panel',
    component: AgentPanelPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
