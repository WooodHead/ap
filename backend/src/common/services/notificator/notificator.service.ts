import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NotificatorConfig } from './notificator-config.interface';
import { MongoStreamService } from '../mongo-stream.service';

@Injectable()
export class NotificatorService {
  private notificatorTypesMap = {
    custom: 'NotifUidPopUp',
    inRing: 'NotifUidInRing',
    inAnswer: 'NotifUidInAnswer',
    outgoingCall: 'NotifUidOUT',
  };

  private _config: NotificatorConfig;
  private agentsMap = {};

  constructor(
    @InjectModel('ClientSchema') private clientModel: Model,
    @InjectModel('QueueMember') private queueMemberModel: Model,
    private mongoStreamService: MongoStreamService,
  ) {}

  async init() {
    this.config = await this.getNotificatorConfig();
    this.agentsMap = await this.getAgentsMap();

    // FIXME better to place into constructor but it has different "this" instance
    // listen to clientSchema and update our notificator config accordingly
    this.mongoStreamService.open('clientModel', data => this.config = data);
  }

  shouldNotify(data) {
    if (this.config.enabled) {
      const type = this.config.type;

      if (!this.agentsMap[data.QueueMember]) {
        this.agentsMap[data.QueueMember] = {};
      }

      const agentNotificatorData = this.agentsMap[data.QueueMember];

      if (data[type] !== agentNotificatorData[this.config.type]) {
        agentNotificatorData[type] = data[type];

        return true;
      }
    }
  }

  private async getNotificatorConfig() {
    return await this.clientModel
      .findOne({}, 'enableNotificator notificatorConfigs')
      .lean();
  }

  private async getAgentsMap() {
    const notificatorFieldsToFetch = Object
      .values(this.notificatorTypesMap)
      .reduce(
        (res, notificatorType) => {
          return Object.assign(res, { [notificatorType]: `$${notificatorType}` });
        },
        {},
      );

    /*
    * result:
    * [{
    *   _id: QUEUE_MEMBER_VALUE,
    *   notificator: {
    *     NotifyUidOUT: VALUE,
    *     ...,
    *     ...,
    *     ...,
    *   },
    *   ...,
    * }]
    */
    const agentsMap = await this.queueMemberModel.aggregate([{
      $group: {
        _id: '$QueueMember',
        notificator: {
          $first: notificatorFieldsToFetch,
        },
      },
    }]);

    return agentsMap.reduce(
      (res, data) => {
        return Object.assign(res, { [data._id]: data.notificator });
      },
      {},
    );
  }

  get config() {
    return this._config;
  }

  set config(config: any) {
    this._config = {
      enabled: config.enableNotificator,
      type: this.notificatorTypesMap[config.notificatorConfigs.notificatorType],
    };
  }
}
