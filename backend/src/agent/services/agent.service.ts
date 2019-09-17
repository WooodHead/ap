import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Config } from '../interfaces/config.interface';
import * as columnsMap from '../../../config/map-columns.json';
import { ConfigService } from '../../common/services/config.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Agents } from '../entities/agents.entity';

interface Column {
  show: boolean;
  orderId: number;
  key: string;
  editable: boolean;
}

@Injectable()
export class AgentService {
  private mapConfig(type, config: Column[]) {
    return Object
      .keys(config)
      .filter(columnKey => config[columnKey].show)
      .sort((key1, key2) => config[key1].orderId - config[key2].orderId)
      .map((columnKey) => {
        const key = config[columnKey].key || columnKey;

        if (!columnsMap[type][key]) {
          console.log('agent.service.ts::mapConfig::17 >>>> UNKNOWN COLUMN ', key);

          return {
            key,
            title: key,
            type: 'static',
          };
        }

        const editable = config[key].editable;
        return Object.assign(columnsMap[type][key], { editable });
      });
  }

  constructor(
    @InjectModel('PauseType') private pauseTypeModel: Model,
    @InjectModel('ClientSchema') private clientModel: Model,
    @InjectModel('Session') private sessionModel: Model,
    @InjectModel('CallRate') private callRateModel: Model,
    @InjectRepository(Agents) private agentsRepository,
    private config: ConfigService,
  ) { }

  private getInitialConfig(config) {
    return {
      language: config.language,
      version: process.env.npm_package_version,
      webrtc: this.config.webrtc,
      agentPanel: this.config.agentPanelConfig,
      port: this.config.port,
    };
  }

  async checkSession(sid) {
    return await this.sessionModel
      .findOne({ sid })
      .then(res => !!res);
  }

  async getConfig(initial: boolean, userId?: string): Promise<Config> {
    let userDialerEnabled = true;
    if (userId) {
      [{ dialer: userDialerEnabled }] = await this.agentsRepository.find({
        select: ['dialer'],
        where: { number: userId },
      });
    }
    const [pauses, config] = await Promise.all([
      this.pauseTypeModel.find({}, '-_id'),
      this.clientModel.findOne({}).lean(),
    ]);

    const initialConfig = this.getInitialConfig(config);

    if (initial) {
      return initialConfig;
    }

    const dialerColumnsConfig = Object.assign(
      config.dialerCommonColumnsConfig,
      config.dialerInCallColumnsConfig,
    );

    const columns = {
      'call-center': this.mapConfig('call-center', config.columnsConfig),
      dialer: this.mapConfig('dialer', dialerColumnsConfig),
    };

    return Object.assign(initialConfig, {
      pauses,
      columns,
      dialerEnabled: userDialerEnabled
        && this.config.sources
        && this.config.sources.dialerEnabled
        && config.enableDialer,
      dialerUrl: ConfigService.dialerUrl,
      dispositionCallAutomatically: config.dispositionCallAutomatically,
      enableDispositionModal: config.enableDispositionModal,
      notificator: {
        enabled: config.enableNotificator,
        type: config.notificatorConfigs.notificatorType,
        action: config.notificatorConfigs.notificatorAction,
        message: config.notificatorConfigs.notificatorMessage,
        autoOpen: config.notificatorConfigs.notificatorAutoOpen,
        url: config.notificatorConfigs.notificatorUrl,
        closeAutomatically: config.notificatorConfigs.notificatorCloseAutomatically,
      },
    });
  }

  async rateCall(data) {
    await this.callRateModel.create(data);
  }
}
