import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { stringify } from 'querystring';
import { ConfigService } from '../config.service';

import { InjectRepository } from '@nestjs/typeorm';
import { Agent } from '../../../agent/dialer/entities/agent.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ViciService {
  // FIXME: Take it from config!
  private initialParams = {
    user: 'voicespin',
    pass: 'vs6045',
  };

  private url: string;

  constructor(
    private httpService: HttpService,
    @InjectRepository(Agent) private agentModel: Repository<Agent>,
  ) {
    this.url = `http://${ConfigService.mysql.host}`;
  }

  async pause({ agentId, pauseCode }) {
    await this.request({
      agent_user: agentId,
      function: 'external_pause',
      value: 'PAUSE',
      pause_code: pauseCode,
    });
  }

  async unpause({ agentId }) {
    await this.request({
      agent_user: agentId,
      function: 'external_pause',
      value: 'RESUME',
      pause_code: '',
    });
  }

  async hangup({ agentId }) {
    await this.request({
      agent_user: agentId,
      function: 'external_hangup',
      value: '1',
    });
  }

  async setStatus(data) {
    await this.request({
      agent_user: data.agentId,
      function: 'external_status',
      value: data.status,
      pause_after_dispo: data.returnToPause ? 1 : 0,
    });

    data.dispo_choice = data.status;

    await this.updateLead(data);
  }

  async setCallback(data) {
    const date = data.datetime.split(' ')[0].split('/');
    const time = data.datetime.split(' ')[1];

    // MM/DD/YYYY => YYYY-MM-DD
    const callbackDatetime = `${date[2]}-${date[0]}-${date[1]} ${time}`;

    await this.request({
      agent_user: data.agentId,
      function: 'external_status',
      value: 'CALLBK',
      pause_after_dispo: data.returnToPause ? 1 : 0,
      callback_comments: data.comments,
      callback_datetime: callbackDatetime,
      callback_type: 'USERONLY',
    });

    data.recipient = 'USERONLY';
    data.dispo_choice = 'CBHOLD';
    data.CallBackLeadStatus = 'CALLBK';
    data.CallBackDatETimE = callbackDatetime;

    await this.updateLead(data);
  }

  async updateLead(data) {
    await this.request(
      {
        ...data.lead,
        agent_user: data.agentId,
        function: 'update_lead',
      },
      true,
    );
  }

  async dial(data) {
    const params:any = {
      agent_user: data.agentId,
      function: 'external_dial',
      search: 'YES',
      preview: 'NO',
      focus: 'NO',
      phone_code:  '',
    };

    if (data.leadId) { // for redial and callback
      params.lead_id = data.leadId;
    }

    // callback_id -> for callback calls
    if (data.callbackId) {
      params.callback_id = data.callbackId;
    }

    if (data.phoneNumber) { // for manual dial
      params.value = data.phoneNumber;
    }

    await this
      .request(params)
      .then((res) => {
        if (res.includes('ERROR')) {
          console.error({ res, msg: 'Manual dial' });
          throw new HttpException({ message: 'panel.dialer.no-dial' }, 500);
        }
      });
  }

  async transfer(data) {
    const params:any = {
      agent_user: data.agentId,
      function: 'transfer_conference',
      value: 'BLIND_TRANSFER',
      phone_number: data.phoneNumber,
    };

    await this
      .request(params)
      .then((res) => {
        if (res.includes('ERROR')) {
          console.error({ res, msg: 'Transfer' });
          throw new HttpException({ message: 'panel.dialer.no-transfer' }, 500);
        }
      });
  }

  async hold(data) {
    const params:any = {
      agent_user: data.agentId,
      function: 'park_call',
      value: data.body.onHoldState ? 'PARK_CUSTOMER' : 'GRAB_CUSTOMER',
    };

    await this
      .request(params)
      .then((res) => {
        if (res.includes('ERROR')) {
          console.error({ res, msg: 'Hold' });
          throw new HttpException({ message: 'panel.dialer.no-hold' }, 500);
        }
      });
  }

  async logout(agentId) {
    await this.request({
      agent_user: agentId,
      function: 'logout',
      value: 'LOGOUT',
    });
  }

  private request(params, nonAgentApi = false) {
    let url = this.url;

    url += nonAgentApi ? '/vicidial/non_agent_api.php' : '/agc/api.php';
    url += `?${stringify(this.initialParams)}&${stringify({ ...params, source: 'crmexample' })}`;

    return this.httpService
      .post(url)
      .toPromise()
      .then(res => res.data)
      .catch(err => console.error('ERR >>>> ', err.message || err));
  }
}
