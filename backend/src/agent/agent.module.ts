import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  Lead,
  Agent,
  LeadExtra,
  LiveChannel,
  ParkedChannel,
} from './dialer/entities/index';

import { CallCenterModule } from './call-center/call-center.module';
import { DialerModule } from './dialer/dialer.module';
import { AgentController } from './agent.controller';
import { AgentService } from './services/agent.service';
import { AgentGateway } from './services/agent.gateway';
import { MongoStreamService } from '../common/services/mongo-stream.service';
import { ClientService } from '../common/services/client.service';
import { NotificatorService } from '../common/services/notificator/notificator.service';
import { DataService } from '../common/services/data.service';
import { RealTimeDataService } from '../common/services/rt-data.service';

import { clientSchema } from './schemas/client.schema';
import { callRateSchema } from './schemas/call-rate.schema';
import { SqlStreamService } from '../common/services/sql-stream.service';
import { UtilsService } from '../common/services/utils.service';
import { ConfigService } from '../common/services/config.service';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'ClientSchema', schema: clientSchema },
      { name: 'CallRate', schema: callRateSchema },
    ]),
    TypeOrmModule.forFeature([
      Lead,
      Agent,
      LeadExtra,
      LiveChannel,
      ParkedChannel,
    ]),
    CallCenterModule,
    DialerModule,
    ContactsModule,
  ],
  controllers: [AgentController],
  exports: [MongooseModule],
  providers: [
    AgentGateway,
    AgentService,
    MongoStreamService,
    SqlStreamService,
    ClientService,
    NotificatorService,
    DataService,
    RealTimeDataService,
    UtilsService,
    ConfigService,
  ],
})
export class AgentModule {}
