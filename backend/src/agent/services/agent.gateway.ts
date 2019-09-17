import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataService } from '../../common/services/data.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from '../dialer/entities/agent.entity';
import { Lead } from '../dialer/entities/lead.entity';

@WebSocketGateway()
export class AgentGateway implements OnGatewayDisconnect {
  @WebSocketServer() server;

  constructor(
    @InjectModel('QueueMember') private queueMemberModel: Model,
    @InjectModel('Queue') private queueModel: Model,
    @InjectRepository(Agent) private agentModel: Repository<Agent>,
    @InjectRepository(Lead) private leadModel: Repository<Lead>,
    private dataService: DataService,
  ) {}

  handleDisconnect() {
    // close mongo stream ...
  }

  @SubscribeMessage('open_room')
  async onEvent(client, { agent, mode }) {
    const roomId = agent + mode;

    client.join(roomId);

    let action;
    let data;

    if (mode === 'dialer') {
      client.leave(`${agent}call-center`);
      action = '[Agent Panel] Set Dialer Data';

      data = await this.agentModel.findOne({
        where: { user: agent },
        join: {
          alias: 'user',
          leftJoinAndSelect: {
            lead: 'user.lead',
            leadExtra: 'user.leadExtra',
          },
        },
      });

      if (data && data.lead) {
        Object.assign(data, data.lead, data.leadExtra);

        delete data.lead;
        delete data.leadExtra;
      }
    } else {
      client.leave(`${agent}dialer`);

      action = '[Agent Panel] Set Data';
      data = await this.queueMemberModel
        .find({ QueueMember: agent })
        .lean()
        .then(res => res.map(data => this.dataService.normalize(data)));

      const queues = data.map(queue => queue.Queue);

      await this.queueModel
        .find({
          Queue: { $in: queues },
        })
        .then((queuesData) => {
          for (const row of queuesData) {
            const queue = data.find(i => i.Queue === row.Queue);

            if (queue) {
              queue.WaitingCalls = row.WaitingCalls;
            }
          }
        });
    }

    this.sendToRoom(roomId, action, data);
  }

  sendToRoom(roomId, action, data) {
    this.server.sockets
      .in(roomId)
      .emit('DISPATCH_ACTION', {
        type: action,
        payload: data,
      });
  }
}
