import { HttpModule, Module } from '@nestjs/common';
import { CallCenterController } from './call-center.controller';
import { CallCenterService } from './services/call-center.service';
import { MongooseModule } from '@nestjs/mongoose';
import { agentSchema } from '../schemas/agent.schema';
import { extensionSchema } from '../schemas/extension.schema';
import { queueMemberSchema } from '../schemas/queue-member.schema';
import { sessionSchema } from '../schemas/session.schema';
import { AMIService } from '../../common/services/ami/ami.service';
import { pauseTypeSchema } from '../schemas/pause.schema';
import { ConfigService } from '../../common/services/config.service';
import { UtilsService } from '../../common/services/utils.service';
import { queueSchema } from '../schemas/queue.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agents } from '../entities/agents.entity';
import { Extension } from '../entities/extension.entity';
import { CallsHistory } from '../entities/call-center/calls-history.entity';
import { ContactsModule } from '../contacts/contacts.module';
import { ContactsService } from '../contacts/services/contacts.service';

@Module({
  imports: [
    HttpModule,
    ContactsModule,
    MongooseModule.forFeature(
      [
        { name: 'Agent', schema: agentSchema },
        { name: 'Extension', schema: extensionSchema },
        { name: 'PauseType', schema: pauseTypeSchema },
        { name: 'Queue', schema: queueSchema },
        { name: 'QueueMember', schema: queueMemberSchema },
      ],
      'aqm',
    ),
    MongooseModule.forFeature([
      { name: 'Session', schema: sessionSchema },
    ]),
    TypeOrmModule.forFeature([Extension], 'asterisk'),
    TypeOrmModule.forFeature([Agents], 'asterisk'),
    TypeOrmModule.forFeature([CallsHistory], 'callcenter'),
  ],
  exports: [MongooseModule],
  controllers: [CallCenterController],
  providers: [
    CallCenterService,
    ContactsService,
    ConfigService,
    AMIService,
    UtilsService,
  ],
})
export class CallCenterModule {}
