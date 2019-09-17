import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PauseCode } from '../entities/dialer/pause-code.entity';
import {
  Log,
  Lead,
  User,
  Agent,
  Hopper,
  Status,
  Channel,
  Callback,
  Campaign,
  UserGroup,
  LeadExtra,
  LiveChannel,
  ParkedChannel,
} from './entities';

import { DialerController } from './dialer.controller';
import { DialerService } from './services/dialer.service';
import { ViciService } from '../../common/services/vici/vici.service';
import { UtilsService } from '../../common/services/utils.service';
import { sessionSchema } from '../schemas/session.schema';
import { changeCampaignSchema } from '../schemas/change.campaign.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Log,
      Lead,
      User,
      Agent,
      Hopper,
      Status,
      Channel,
      Callback,
      Campaign,
      UserGroup,
      LeadExtra,
      LiveChannel,
      ParkedChannel,
    ]),
    MongooseModule.forFeature([
      { name: 'Session', schema: sessionSchema },
    ]),
    MongooseModule.forFeature(
      [
        { name: 'ChangeCampaign', schema: changeCampaignSchema },
      ],
      'admin',
    ),
    TypeOrmModule.forFeature([PauseCode], 'asteriskcdrdb'),
  ],
  controllers: [DialerController],
  providers: [
    DialerService,
    ViciService,
    UtilsService,
  ],
})
export class DialerModule { }
