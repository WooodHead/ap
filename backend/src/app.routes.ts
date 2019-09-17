import { Routes } from 'nest-router';
import { AppModule } from './app.module';
import { DialerModule } from './agent/dialer/dialer.module';
import { CallCenterModule } from './agent/call-center/call-center.module';
import { AgentModule } from './agent/agent.module';
import { ContactsModule } from './agent/contacts/contacts.module';

export const routes: Routes = [{
  path: '/api',
  module: AppModule,
  children: [
    {
      path: '/agent',
      module: AgentModule,
      children: [
        {
          path: '/call-center',
          module: CallCenterModule,
        },
        {
          path: '/dialer',
          module: DialerModule,
        },
        {
          path: '/contacts',
          module: ContactsModule,
        },
      ],
    },
  ],
}];
