/* tslint:disable */
import { Injectable } from '@nestjs/common';
import * as AsteriskManager from 'asterisk-manager';
import { AMIDto } from './ami.dto';
import { AMIActionParams } from './ami-action-params.model';
import { ConfigService } from '../config.service';

@Injectable()
export class AMIService {
  private ami: AsteriskManager;

  constructor(config: ConfigService) {
    this.ami = new AsteriskManager(...Object.values(config.ami));
    this.ami.keepConnected();
  }

  login (data: AMIDto): Promise<any> {
    return this.send({
      exten: 'login',
      actionid: AMIActionParams.generateActionId('login'),
      variable: { __AGENTCODE: data.agent, __AGENT_EXT: data.extension },
    });
  }

  logout(data: AMIDto): Promise<any> {
    return this.send({
      exten: 'logout',
      actionid: AMIActionParams.generateActionId('logout'),
      variable: { __AGENTCODE: data.agent },
    });
  }

  pause(data: AMIDto): Promise<any> {
    return this.send({
      exten: 'pause',
      actionid: AMIActionParams.generateActionId('pause'),
      variable: { __AGENTCODE: data.agent, __PAUSEREASON: data.pauseCode },
    });
  }

  unpause(data: AMIDto): Promise<any> {
    return this.send({
      exten: 'unpause',
      actionid: AMIActionParams.generateActionId('unpause'),
      variable: { __AGENTCODE: data.agent },
    });
  }

  hangup(data: AMIDto): Promise<any> {
    return this.send({
      exten: 'hangup',
      actionid: AMIActionParams.generateActionId('hangup'),
      variable: { __AGENT_EXT: data.extension },
    });
  }

  spy(data: AMIDto): Promise<any> {
    return this.send({
      channel: 'Local/' + data.extension + '@from-internal',
      exten: 'spySIP/' + data.sourceExtension,
      actionid: AMIActionParams.generateActionId('spy'),
      callerid: 'spySIP/' + data.sourceExtension,
    });
  }

  whisper(data: AMIDto): Promise<any>  {
    return this.send({
      channel: 'Local/' + data.extension + '@from-internal',
      exten: 'whisperSIP/' + data.sourceExtension,
      actionid: AMIActionParams.generateActionId('whisper'),
      callerid: 'whisperSIP/' + data.sourceExtension,
    });
  }

  barge(data: AMIDto): Promise<any> {
    return this.send({
      channel: 'Local/' + data.extension + '@from-internal',
      exten: 'bargeSIP/' + data.sourceExtension,
      actionid: AMIActionParams.generateActionId('barge'),
      callerid: 'bargeSIP/' + data.sourceExtension,
    });
  }

  redirect(data: AMIDto): Promise<any> {
    return this.send({
      action: 'Redirect',
      channel: data.channel,
      exten: data.extension,
      context: 'custom-redirect',
      callerid: 'Redirect' + Math.floor(Date.now() / 1000),
    });
  }

  private send(params) {
    const actionParams = new AMIActionParams(params);

    return new Promise((resolve , reject) => {
      this.ami.action(actionParams, (err, res) => {

        if (err) {
          console.log('ERROR');
          reject(err);
          return;
        }

        resolve(res);
      });
    });
  }
}
