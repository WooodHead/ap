import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import * as MySQLEvents from '@rodrigogs/mysql-events';

import {
  Lead,
  Agent,
  LeadExtra,
  Campaign,
  LiveChannel,
  ParkedChannel,
} from '../../agent/dialer/entities';
import { PauseCode } from '../../agent/entities/dialer/pause-code.entity';

import { MongoStreamService } from './mongo-stream.service';
import { SqlStreamService } from './sql-stream.service';
import { ClientService } from './client.service';
import { NotificatorService } from './notificator/notificator.service';
import { AgentGateway } from '../../agent/services/agent.gateway';
import { DataService } from './data.service';
import { UtilsService } from './utils.service';

@Injectable()
export class RealTimeDataService {
  private readonly systemLiveChannelExtensions = [
    'ring',
    'park_CID.agi',
  ];
  constructor(
    mongoStreamService: MongoStreamService,
    sqlStreamService: SqlStreamService,
    dataService: DataService,
    clientService: ClientService,
    private agentGateway: AgentGateway,
    private utilsService: UtilsService,
    @InjectModel('QueueMember') private queueMemberModel: Model,
    @InjectRepository(Lead) private leadModel,
    @InjectRepository(LeadExtra) private leadExtraModel,
    @InjectRepository(Agent) private agentModel,
    @InjectRepository(Campaign) private campaignModel,
    @InjectRepository(PauseCode) private pauseCodeModel,
    @InjectRepository(LiveChannel) private liveChannelModel,
    @InjectRepository(ParkedChannel) private parkedChannelModel,
    @InjectModel('PauseType') private pauseTypeModel: Model,
    private notificatorService: NotificatorService,
  ) {
    // call center
    mongoStreamService.open(
      'queueModel',
      async (data) => {
        const agents = await this.queueMemberModel.distinct('QueueMember', {
          Queue: data.Queue,
          Extension: { $ne: '' },
        });

        for (const agent of agents) {
          agentGateway.sendToRoom(
            `${agent}call-center`,
            '[Agent Panel] Update Queue Waiting Calls',
            data,
          );
        }
      },
      'WaitingCalls',
    );

    mongoStreamService.open('queueMemberModel', (data) => {
      if (dataService.isLoggedOut(data)) {
        const action = '[Auth] Logout';

        return clientService
          .removeSession(data.QueueMember)
          .then(() => {
            return agentGateway.sendToRoom(`${data.QueueMember}call-center`, action, data);
          });
      }

      if (notificatorService.shouldNotify(data)) {
        const action = '[Agent Panel] Open notificator';
        agentGateway.sendToRoom(`${data.QueueMember}call-center`, action, data);
      }

      dataService.normalize(data);

      const action = '[Agent Panel] Update Data';
      agentGateway.sendToRoom(`${data.QueueMember}call-center`, action, data);
    });

    // dialer
    sqlStreamService.open(
      'live_sip_channels',
      this.liveSipChannels.bind(this),
      this.liveSipChannelsError.bind(this),
    );

    sqlStreamService.open(
      'vicidial_live_agents.status',
      this.vicidialLiveAgents.bind(this),
      this.vicidialLiveAgentsError.bind(this),
    );

    sqlStreamService.open(
      'vicidial_live_agents.campaign_id',
      this.campaignChanged.bind(this),
      this.campaignChangedError.bind(this),
    );

    sqlStreamService.open(
      'vicidial_log',
      this.dialerLogChanged.bind(this),
      null,
    );

    sqlStreamService.open(
      'live_channels',
      this.liveChannelChanged.bind(this),
      null,
      MySQLEvents.STATEMENTS.DELETE,
    );

    sqlStreamService.open(
      'vicidial_live_agents',
      this.vicidialLiveAgentsDelete.bind(this),
      null,
      MySQLEvents.STATEMENTS.DELETE,
    );
  }

  /**
   * Lead Disconected and Hold button logic (crutch)
   * 1. If this is call, witch did not be in hold, we need
   *  just check [live_sip_channels, live_channel, parked_channel].
   *  If we have some value in parked_channel - agent is in hold state.
   * 2. If parked_channel is empty and call still active - we have
   *  active channel in live_channel with non system extension. All channels from
   *  live_sip_channels already deleted. So we have only live_channel.
   * 3. If we see DELETE event in live_channel with non system extension,
   * need to emit Lead Disconnected event
   */

  private async liveChannelChanged(oldData, data) {
    if (!data
      && oldData
    ) {
      const parkedChannel = await this.parkedChannelModel.findOne({ channel: oldData.channel });
      const liveChannel = await this.liveChannelModel.findOne({ channel: oldData.channel });
      let agent;

      // When lead hang up from hold state
      if (parkedChannel && !liveChannel) {
        agent = await this.agentModel.findOne({ extention: parkedChannel.parked_by });
      }

      // When lead hang up from incall state
      if (!parkedChannel && !liveChannel) {
        agent = await this.agentModel.findOne({ conf_exten: oldData.extension });
      }

      if (agent) {
        this.agentGateway.sendToRoom(
          `${agent.user}dialer`,
          '[Dialer] Lead Disconnected',
          { phoneNumber: '' });
      }
    }
  }

  private async dialerLogChanged(oldData, data) {
    // Lead disconnected during auto-dial
    if (
      oldData && data &&
      oldData.term_reason === 'NONE' &&
      data.term_reason !== 'NONE'
    ) {
      await this.utilsService.sleep();

      this.agentGateway.sendToRoom(
        `${oldData.user}dialer`,
        '[Dialer] Lead Disconnected',
        { phoneNumber: oldData.phone_code + oldData.phone_number });
    }
  }

  private async campaignChangedError() {
    const promiseArray = [];

    const data = await this.agentModel.find({});
    data.forEach((item) => {
      promiseArray.push(this.campaignChanged(null, item));
    });
    return await Promise.all(promiseArray);
  }

  private async campaignChanged(oldData, data) {
    if (data && data.campaign_id) {
      const campaign = await this.campaignModel
        .findOne({ campaign_id: data.campaign_id });
      data.campaign = campaign;

      this.agentGateway
        .sendToRoom(`${data.user}dialer`, '[Dialer] Detected Active Campaign Changed', campaign);
    }
  }

  private async vicidialLiveAgentsDelete(oldData) {
    this.agentGateway.sendToRoom(`${oldData.user}dialer`, '[Dialer] Logout', {});
  }

  private async vicidialLiveAgents(oldData, data) {
    if (data) {
      data.Status = data.status;

      if (data.lead_id) {
        const lead = await this.leadModel.findOne({ lead_id: data.lead_id });
        const leadExtra = await this.leadExtraModel.findOne({ lead_id: data.lead_id });

        Object.assign(data, lead, leadExtra);
        data.phoneNumber = lead.phoneNumber;
      }
      if (data.external_pause_code) {
        let pause = await this.pauseTypeModel.findOne({ pauseCode: data.external_pause_code });
        data.external_pause_reason = pause && pause.pauseReason ?
          pause.pauseReason : '';
        if (!data.external_pause_reason) {
          pause = await this.pauseCodeModel
            .findOne({ pcode: data.external_pause_code });
          data.external_pause_reason = pause && pause.pauseReason ?
            pause.pcode_desc : '';
        }
      }

      this.agentGateway.sendToRoom(`${data.user}dialer`, '[Agent Panel] Set Dialer Data', data);
    }
  }

  private async liveSipChannels(oldData, data) {
    if (!data && oldData) {
      // Dialer disconnected
      if (
        !isNaN(parseInt(oldData.extension, 10)) // is numeric
        && oldData.channel.includes('SIP')
      ) {
        const agent = await this.agentModel.findOne({ conf_exten: oldData.extension });

        if (agent) {
          this.agentGateway.sendToRoom(`${agent.user}dialer`, '[Dialer] Disconnected', {});
        }
      }
      // Lead disconnected during manual dial
      if (
        oldData.channel_data.includes('SIP')
        && oldData.channel.match(/[/]\d+[@]/)
      ) {
        const confExten = oldData.channel.replace(/^.*?[/](\d+)[@].*$/, '$1');
        const phoneNumber = oldData.channel_data.replace(/.*[/](\d+)[,].*$/, '$1');
        const agent = await this.agentModel.findOne({ conf_exten: confExten });

        if (agent) {
          let isHoldEvent = false;
          const parkedChannel = await this.parkedChannelModel
            .findOne({ parked_by: agent.extension });
          const liveChannel = await this.liveChannelModel.findOne({ extension: confExten });

          isHoldEvent = !!parkedChannel && !liveChannel
            || !parkedChannel && !!liveChannel;

          !isHoldEvent && this.agentGateway.sendToRoom(
            `${agent.user}dialer`,
            '[Dialer] Lead Disconnected',
            { phoneNumber });
        }
      }
    }
  }

  private async liveSipChannelsError() {
    const promiseArray = [];

    const data = await this.agentModel.find({});
    data.forEach((item) => {
      promiseArray.push(this.liveSipChannels(null, item));
    });
    return await Promise.all(promiseArray);
  }

  private async vicidialLiveAgentsError() {
    const promiseArray = [];

    const data = await this.agentModel.find({});
    data.forEach((item) => {
      promiseArray.push(this.vicidialLiveAgents(null, item));
    });
    return await Promise.all(promiseArray);
  }

  async init() {
    await this.notificatorService.init();
  }
}
