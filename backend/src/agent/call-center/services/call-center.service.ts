import { Model } from 'mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LoginAgentDto } from '../dto/login-agent.dto';
import { AMIService } from '../../../common/services/ami/ami.service';
import { ConfigService } from '../../../common/services/config.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Extension } from '../../entities/extension.entity';
import { CallsHistory } from '../../entities/call-center/calls-history.entity';
import { Between, MoreThan } from 'typeorm';
import { ContactsService } from '../../contacts/services/contacts.service';
import { Contact } from '../../contacts/interfaces/contact.interface';
import { Agents } from '../../entities/agents.entity';

@Injectable()
export class CallCenterService {
  constructor(
    private amiService: AMIService,
    @InjectModel('Agent') private agentModel: Model,
    @InjectModel('Extension') private extensionModel: Model,
    @InjectModel('QueueMember') private queueMemberModel: Model,
    @InjectModel('Session') private sessionModel: Model,
    @InjectRepository(Extension) private astExtensionRepository,
    @InjectRepository(CallsHistory) private callsHistoryRepository,
    @InjectRepository(Agents) private agentsRepository,
    private config: ConfigService,
    private contactsService: ContactsService,
  ) {}

  private rejectLogin(message, params?: any) {
    const reason = {
      params,
      message: `login.errors.${message}`,
    };

    throw new HttpException(reason, 401);
  }

  async login(loginAgentDto: LoginAgentDto, { sid, host }): Promise<any> {
    const agent = await this.agentModel
      .findOne({
        agentNumber: loginAgentDto.agent,
      })
      .lean();

    // agent does not exist
    if (!agent) {
      this.rejectLogin('no-agent');
    }

    const [{ active }] = await this.agentsRepository.find({
      select: ['active'],
      where: { number: loginAgentDto.agent },
    });

    // agent is deactivated
    if (!active) {
      this.rejectLogin('not-active');
    }

    // extensions does not exist
    const extension = await this.extensionModel
      .findOne({ ExtensionNumber: loginAgentDto.extension })
      .lean();

    if (!extension) {
      this.rejectLogin('no-extension');
    }

    if (this.config.webrtc && loginAgentDto.useWebRTC) {
      const isSecretCorrect = await this.astExtensionRepository
        .findOne({
          where: {
            id: loginAgentDto.extension,
            data: loginAgentDto.secret,
            keyword: 'secret',
          },
        });

      if (!isSecretCorrect) {
        this.rejectLogin('incorrect-secret');
      }
    }

    // TODO get from config?
    // extension is not for agent
    if (extension.Context !== this.config.extensionContext) {
      this.rejectLogin('not-agent-extension');
    }

    const queueMember = await this.queueMemberModel
      .findOne({ QueueMember: loginAgentDto.agent })
      .lean();

    // agent is not in any queue
    if (!queueMember) {
      this.rejectLogin('no-queue');
    }

    // agent is already connected to another extension
    if (queueMember.Extension && queueMember.Extension !== loginAgentDto.extension) {
      this.rejectLogin('agent-busy', { extension: queueMember.Extension });
    }

    // no extension for agent
    if (queueMember.Extension === undefined) {
      this.rejectLogin('no-extension-for-agent');
    }

    const extensionUsage = await this.queueMemberModel
      .findOne({
        Extension: loginAgentDto.extension,
        QueueMember: {
          $ne: loginAgentDto.agent,
        },
      })
      .lean();

    // another agent already connected to this extension
    if (extensionUsage) {
      this.rejectLogin('extension-busy', {
        username: extensionUsage.Name,
        agent: extensionUsage.QueueMember,
      });
    }

    const session = await this.sessionModel.findOne({
      agent: loginAgentDto.agent,
      sid: {
        $ne: sid,
      },
    });

    // there is an open connection for provided pair agent/extension
    if (session) {
      this.rejectLogin('agent-extension-online');
    }

    const amiResponse = await this.amiService.login(loginAgentDto);

    if (!amiResponse) {
      this.rejectLogin('unknown-error');
    }

    const sessionExists = await this.sessionModel.findOne({ agent: loginAgentDto.agent });

    if (sessionExists) {
      await this.sessionModel.updateOne({ agent: loginAgentDto.agent }, { sid });
    } else {
      await this.sessionModel.create({
        sid,
        agent: loginAgentDto.agent,
        extension: loginAgentDto.extension,
      });
    }

    return {
      ...loginAgentDto,
      username: agent.agentName,
    };
  }

  async pause(data) {
    await this.amiService.pause(data);
  }

  async unpause(data) {
    await this.amiService.unpause(data);
  }

  async hangup(data) {
    await this.amiService.hangup(data);
  }

  async logout(data) {
    await this.amiService.logout(data);
  }

  async getCallsHistory(agentId, dateRange = 'today') {
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

    const historyPromise = this.callsHistoryRepository.find({
      select: ['callerName', 'callerNumber', 'datetime', 'duration', 'type'],
      where: { agentId, ...dateWhere },
      order: { datetime: 'DESC' },
    });

    const contactsPromise = this.contactsService
      .getList(agentId)
      .then(contacts => contacts.reduce(
        (res, contact) => {
          delete contact.agentId;
          res[contact.number] = contact;
          return res;
        },
        {},
      ));

    const [history, contacts] = await Promise.all([historyPromise, contactsPromise]);

    return history.map((row) => {
      delete row.agentId;

      if (
        (!row.callerName || row.callerName === row.callerNumber)
        && contacts[row.callerNumber]
      ) {
        const contact: Contact = contacts[row.callerNumber];
        row.callerName = `${contact.firstName || ''} ${contact.lastName || ''}`;
        row.contact = contact;
      }

      return row;
    });
  }
}
