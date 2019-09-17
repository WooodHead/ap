/* tslint:disable */
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Between, MoreThan, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Injectable } from '@nestjs/common';

import { ViciService } from '../../../common/services/vici/vici.service';
import { LoginAgentDto } from '../dto/login-agent.dto';

import {
  Campaign,
  User,
  Callback,
  Log,
  Channel,
  Agent,
  Status,
  LiveChannel,
} from '../entities';

import { UtilsService } from '../../../common/services/utils.service';

@Injectable()
export class DialerService {
  constructor(
    private viciService: ViciService,
    private utilsService: UtilsService,
    @InjectRepository(Campaign) private campaignModel,
    @InjectRepository(User) private userModel,
    @InjectRepository(Callback) private callbackModel,
    @InjectRepository(Log) private logModel,
    @InjectRepository(Channel) private channelModel,
    @InjectRepository(LiveChannel) private liveChannelModel,
    @InjectRepository(Agent) private agentModel,
    @InjectRepository(Status) private statusModel,
    @InjectModel('ChangeCampaign') private changeCampaign: Model,

  ) { }

  // check if dialer user pick up phone and dialer is ready
  private async isAgentInDialer(agentId, expected = true, retry = 20) {
    const session = await this.agentModel
      .findOne({
        select: ['conf_exten'],
        where: { user: agentId },
      })
      .then(async (res) => {
        if (!res) return;

        let session = (await this.channelModel.findOne({ where: { extension: res.conf_exten } }))
          || (await this.liveChannelModel.findOne({ where: { extension: res.conf_exten } }));

        return session;
      });

    if (!!session === expected) {
      return true;
    }

    // FIXME move to config
    if (!retry) {
      return false;
    }

    await this.utilsService.sleep(500);
    return this.isAgentInDialer(agentId, expected, --retry);
  }

  // find user group {[allowed campaigns] [user_group]}
  private findUserGroup(user) {
    return this.userModel
      .findOne({
        where: { user },
        join: {
          alias: 'users',
          leftJoinAndSelect: {
            group: 'users.user_group',
          },
        },
      })
      .then(user => user && user.user_group);
  }

  async getCampaigns(agent) {
    const result = {
      userGroup: '',
      campaigns: []
    }
    let whereStr = 'active = \'Y\'';

    // fatch userGroup from mysql
    const userGroup = await this.findUserGroup(agent);

    if (!userGroup || !userGroup.allowed_campaigns) {
      return [];
    }

    // fatch userGroup info from mongo
    const changeCampaign = await this.changeCampaign.findOne({ userGroup: userGroup.user_group });

    if (!userGroup.allowed_campaigns.includes('ALL-CAMPAIGNS')) {
      userGroup.allowed_campaigns = userGroup.allowed_campaigns.trim().replace(' -', '');
      whereStr += ` AND vc.campaign_id IN (${userGroup.allowed_campaigns.trim().replace(/\s/g, ',')})`;
    }

    // FIXME find a way to count in left join
    // fetch active campaigns with leads quantity
    let campaigns = await this.campaignModel
      .query(`
        SELECT
          vc.campaign_id id,
          vc.campaign_name name,
          vc.no_hopper_leads_logins noLeadsLoginAllowed,
          count(vh.campaign_id) leadsQty
        FROM vicidial_campaigns vc
        LEFT JOIN vicidial_hopper vh
        ON vc.campaign_id = vh.campaign_id
        WHERE ${whereStr}
        GROUP BY vc.campaign_id
    `);

    result.campaigns = this.prepareCampaignsInfo(campaigns);

    if (changeCampaign
      && changeCampaign.changeConditions
      && changeCampaign.changeConditions.length
      && changeCampaign.changeConditions[0].config
      && Object.keys(changeCampaign.changeConditions[0].config.limits).length)
    {
      const { limits } = changeCampaign.changeConditions[0].config;

      result.userGroup = userGroup.user_group;
      result.campaigns = result.campaigns.map((item) => {
        return {
          ...item,
          ...(limits[item.id] ? {
            percentage: parseFloat(limits[item.id])
          } : {}),
        }
      })
    }

    return result;
  }

  private prepareCampaignsInfo(campaigns) {
    return campaigns.map(({ leadsQty, noLeadsLoginAllowed, ...item }) => {
      let res = {
        ...item,
        empty: !parseInt(leadsQty, 10),
        noLeadsLoginAllowed: noLeadsLoginAllowed === 'Y'
      };
      return res;
    });
  }

  async getCallbacks(agent) {
    return await this.callbackModel
      .find({
        select: [
          'callback_time',
          'comments',
          'callback_id',
          'status',
        ],
        where: {
          user: agent,
          status: Not('INACTIVE'),
        },
        join: {
          alias: 'callback',
          leftJoinAndSelect: {
            leads: 'callback.lead',
            campaign: 'callback.campaign',
          },
        },
        order: { callback_time: 'ASC' },
      })
      .then((callbacks) => {
        return callbacks.map((callback) => {
          const lead = callback.lead || {};
          const campaign = callback.campaign;

          let datetime = callback.callback_time;

          if (new Date(datetime).toString() === 'Invalid Date') {
            datetime = null;
          }

          return {
            leadId: lead.lead_id,
            phoneNumber: lead.phone_number,
            firstName: lead.first_name,
            lastName: lead.last_name,
            campaignName: campaign.campaign_name,
            active: callback.status === 'LIVE',
            comments: callback.comments,
            callbackId: callback.callback_id,
            datetime,
          };
        });
      });
  }

  async getRedial(agentId) {
    return await this.logModel
      .findOne({
        where: { agentId },
        join: {
          alias: 'log',
          leftJoinAndSelect: {
            leads: 'log.lead',
          },
        },
        order: { datetime: 'DESC', lead_id: 'DESC' },
      })
      .then((logData) => {
        const lead = logData.lead;

        if (!lead || !lead.phone_number) {
          return null;
        }

        return {
          leadId: lead.lead_id,
          firstName: lead.first_name,
          lastName: lead.last_name,
          phoneNumber: lead.phone_code + lead.phone_number,
        };
      })
  }

  async getStatuses() {
    return await this.statusModel.find({
      select: ['value', 'title'],
      where: { selectable: 'y' },
      order: { title: 'ASC' },
    })
  }

  async originate(action, data) {
    await this.viciService[action](data);
    return { message: 'ok' };
  }

  async login(data: LoginAgentDto) {
    const isAgentInDialer = await this.isAgentInDialer(data.agent);

    if (!isAgentInDialer) {
      throw new HttpException({ message: 'panel.dialer.no-answer' }, 401);
    }

    return { message: 'ok' };
  }

  async logout(agentId) {
    await this.viciService.logout(agentId);

    const isAgentLoggedOut = await this.isAgentInDialer(agentId, false, 10);

    if (isAgentLoggedOut) return { message: 'ok' };
    else throw new HttpException({ message: 'login.errors.unknown-error' }, 500);
  }

  getCallsHistory(agentId, dateRange = 'today') {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();

    const today = `${year}-${month}-${date}`;
    const dateWhere: any = {};

    switch (dateRange) {
      case 'today':
        dateWhere.datetime = MoreThan(today);
        break;

      case 'yesterday':
        dateWhere.datetime = Between(
          `${year}-${month}-${date - 1}`,
          today,
        );
        break;

      case 'week':
        now.setDate(date - 6);

        dateWhere.datetime = MoreThan(`${year}-${now.getMonth() + 1}-${now.getDate()}`);
        break;

      case 'month':
        dateWhere.datetime = MoreThan(`${year}-${now.getMonth() + 1}-01`);
        break;

      // default is all => do nothing
    }

    return this.logModel
      .find({
        where: {
          agentId,
          ...dateWhere,
        },
        join: {
          alias: 'log',
          leftJoinAndSelect: {
            leads: 'log.lead',
          },
        },
        order: { datetime: 'DESC' },
      })
      .then((res) => {
        return res.map((row) => {
          const lead = row.lead || {};

          return {
            leadId: row.lead_id,
            datetime: row.datetime,
            callerNumber: row.phone_code + row.phone_number,
            callerName: `${lead.first_name} ${lead.last_name}`,
            duration: row.duration,
            type: row.comments.toLowerCase() === 'manual' ? 'OUT' : 'IN',
          };
        });
      });
  }
}
