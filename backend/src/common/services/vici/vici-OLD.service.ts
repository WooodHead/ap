/* tslint:disable */
import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { stringify } from 'querystring';
import { ConfigService } from '../config.service';

@Injectable()
export class ViciServiceOLD {
  private initialParams = {
    user: 'voicespin',
    pass: 'vs6045',
  };
  private loginUrl: string;
  private apiUrl: string;

  constructor(
    private httpService: HttpService,
  ) {
    const initialUrl = `http://${ConfigService.mysql.host}/agc/`;

    this.loginUrl = `${initialUrl}vicidial.php?`;
    this.apiUrl = `${initialUrl}api.php?${stringify(this.initialParams)}&`;
  }

  async test_logout(data) {
    data.stage = 'API';
    data.ACTION = 'userLOGout';
    data.format = 'text';

    console.log(`http://${ConfigService.mysql.host}/agc/vdc_db_query.php?` + stringify(data))

    return this.httpService
      .get(`http://${ConfigService.mysql.host}/agc/vdc_db_query.php?` + stringify(data))
      .toPromise()
      .then((res) => console.log(res.data));
  }

  // channel: SIP/max-00000358 ???? ===>>> from "GETTING DATA OF CUR CALL"
  // CalLCID: V8101800530000000002 ???? ===>>> from "GETTING DATA OF CUR CALL"

  // HANGUP
  async test_HANGUP(t) {
    const data = {
      server_ip: '127.0.0.1',
      conf_exten: '4000',
      session_name: '1533910567_22012892542',
      campaign: '9001',
      user: 139,
      pass: 139,
      qm_extension: 220,
      epoch_sec: '',
      user_abb: '',
    };

    const params = {
      server_ip: data.server_ip,
      call_server_ip: data.server_ip,
      exten: data.conf_exten,
      session_name: data.session_name,
      campaign: data.campaign,
      log_campaign: data.campaign,
      user: data.user,
      pass: data.pass,
      qm_extension: data.qm_extension,
      queryCID: 'HLagcW' + data.epoch_sec + data.user_abb,
      stage: 'CALLHANGUP',
      ACTION: 'Hangup',
      format: 'text',
      secondS: 10, // FIXME send from UI
    };

    console.log(`http://${ConfigService.mysql.host}/agc/manager_send.php?` + stringify(params))

    return this.httpService
      .get(`http://${ConfigService.mysql.host}/agc/manager_send.php?` + stringify(params))
      .toPromise()
      .then((res) => console.log(res.data));
  }

  // uniqueid: 1533913253.4461
  // lead_id: 2
  // list_id: 9001
  // channel: SIP/max-00000358
  // agent_log_id: 265
  // MDnextCID: V8101800530000000002
  // alt_dial: MAIN
  // DB: 0
  // agentchannel: SIP/220-00000357
  // conf_dialed: 0
  // leaving_threeway: 0
  // hangup_all_non_reserved: 1
  // blind_transfer: 0
  // nodeletevdac: undefined
  // alt_num_status: 0
  // called_count: 7

  // HANGUP
  async test_HANGUP_22222(t) {
    const data = {
      server_ip: '127.0.0.1',
      conf_exten: '4000',
      session_name: '1533910567_22012892542',
      ext_context: 'from-dialerV2',
      campaign: '9001',
      dial_method: 'RATIO',
      protocol: 'SIP',
      user: 139,
      pass: 139,
      qm_extension: 220,
      extension: 220,
      epoch_sec: '',
      user_abb: '',
    };

    const params = {
      server_ip: data.server_ip,
      conf_exten: data.conf_exten,
      session_name: data.session_name,
      dial_method: data.dial_method,
      campaign: data.campaign,
      protocol: data.protocol,
      ext_context: data.ext_context,
      user: data.user,
      pass: data.pass,
      qm_extension: data.qm_extension,
      exten: data.extension,
      extension: data.extension,
      user_abb: data.user_abb,
      queryCID: 'HLagcW' + data.epoch_sec + data.user_abb,
      stage: 'end',
      ACTION: 'manDiaLlogCaLL',
      format: 'text',
      inOUT: 'OUT',
      alt_dial: 'MAIN',
      phone_number: '', // FIXME send from UI
    };

    console.log(`http://${ConfigService.mysql.host}/agc/vdc_db_query.php?` + stringify(params))

    return this.httpService
      .get(`http://${ConfigService.mysql.host}/agc/vdc_db_query.php?` + stringify(params))
      .toPromise()
      .then((res) => console.log(res.data));
  }


  // RESUME
  async test_resume(data) {
    data.stage = 'READY';
    data.ACTION = 'VDADready';

    console.log(`http://${ConfigService.mysql.host}/agc/vdc_db_query.php?` + stringify(data))

    return this.httpService
      .get(`http://${ConfigService.mysql.host}/agc/vdc_db_query.php?` + stringify(data))
      .toPromise()
      .then((res) => console.log(res.data));
  }

  // PAUSE
  async test_pause(data) {
    data.stage = 'PAUSED';
    data.ACTION = 'VDADpause';

    console.log(`http://${ConfigService.mysql.host}/agc/vdc_db_query.php?` + stringify(data))

    return this.httpService
      .get(`http://${ConfigService.mysql.host}/agc/vdc_db_query.php?` + stringify(data))
      .toPromise()
      .then((res) => console.log(res.data));
  }

  // MANUAL DIAL
  async test_dial(data) {
    data.phone_number = '380637777777';
    data.phone_code = '';
    data.ACTION = 'manDiaLnextCaLL';
    data.stage = 'lookup';
    data.preview = 'NO';
    data.agent_dialed_type = 'MANUAL_DIALNOW';

    console.log(`http://${ConfigService.mysql.host}/agc/vdc_db_query.php?` + stringify(data));

    return this.httpService
      .get(`http://${ConfigService.mysql.host}/agc/vdc_db_query.php?` + stringify(data))
      .toPromise()
      .then((res) => console.log(res.data));
  }

  async login(data) {
    const params = {
      phone_login: data.extension,
      phone_pass: data.extension,
      extension: data.extension,
      VD_login: data.agent,
      VD_pass: data.agent,
      VD_campaign: data.campaign,
    };

    const url = this.loginUrl + stringify(params);

    return this.httpService
      .post(url)
      .toPromise()
      .then((res) => {
        const dataToFetch = {
          user: 'user',
          pass: 'pass',
          server_ip: 'server_ip',
          session_id: 'conf_exten',
          session_name: 'session_name',
          mdnLisT_id: 'list_id',
          ext_context: 'ext_context',
          campaign: 'campaign',
          dial_timeout: 'dial_timeout',
          dial_prefix: 'dial_prefix',
          campaign_cid: 'campaign_cid',
          extension: 'extension',
          qm_extension: 'qm_extension',
          protocol: 'protocol',
          use_internal_dnc: 'use_internal_dnc',
          use_campaign_dnc: 'use_campaign_dnc',
          omit_phone_code: 'omit_phone_code',
          manual_dial_filter: 'manual_dial_filter',
          manual_dial_search_filter: 'manual_dial_search_filter',
          dial_method: 'dial_method',
          manual_dial_call_time_check: 'manual_dial_call_time_check',
          nocall_dial_flag: 'nocall_dial_flag',
          cid_lock: 'cid_lock',
          epoch_sec: 'epoch_sec',
          user_abb: 'user_abb',
          no_delete_sessions: 'no_delete_sessions',
          LogouTKicKAlL: 'LogouTKicKAlL',
        };

        const data:any = {};

        // TODO remove before push
        require('fs').writeFileSync(__dirname + '/test.html', res.data);

        try {
          Object
            .keys(dataToFetch)
            .forEach((key) => {
              const group = dataToFetch[key];

              // positive lookbehind "var VAR_HERE"
              // any non-word char
              // our named group to fetch
              const regex = new RegExp(`(?<=var\\s${key})\\W+(?<${group}>[\\w-\\.-]+)`);

              data[group] = res.data.match(regex).groups[group];
            });

          // custom
          data.queryCID = 'HLagcW' + data.epoch_sec + data.user_abb;

          return data;
        } catch {
          throw new HttpException({ message: 'No session id' }, 401);
        }
      });
  }

  async pause(data) {
    await this.send({
      agent_user: data.user,
      function: 'external_pause',
      value: 'PAUSE',
    });

    return this.test_pause(data);
  }

  async unpause(data) {
    await this.send({
      agent_user: data.user,
      function: 'external_pause',
      value: 'RESUME',
    });

    return this.test_resume(data);
  }

  async hangup(data) {
    return await this.send({
      agent_user: data.user,
      function: 'external_hangup',
      value: '1',
    })
      .then(() => {

      });
  }

  async setStatus(data) {
    await this.updateLead(data);

    return await this.send({
      agent_user: data.user,
      function: 'external_status',
      value: data.status,
    });
  }

  async setCallback(data) {
    await this.updateLead(data);

    return await this.send({
      agent_user: data.user,
      callback_comments: data.lead.comments,
      callback_datetime: data.datetime,
      function: 'external_status',
      callback_type: 'USERONLY',
      value: 'CALLBK',
    });
  }

  async dial(data) {
    return await this.send({
      agent_user: data.user,
      function: 'external_dial',
      search: 'YES',
      preview: 'NO',
      focus: 'NO',
      phone_code: '', // TODO need or remove?
      value: data.phoneNumber,
    })
      .then((res) => {
        // response example: SUCCESS: external_dial function set - 380637777777|139||YES|NO|NO|52385964|1533912580||||
        // extend data with "vendor_lead_code"
        data.vendor_lead_code = res.split('|')[6];
        data.phone_number = data.phoneNumber;

        return this.test_dial(data);
      });
  }

  private async updateLead(data) {
    const params = Object.assign(
      {
        agent_user: data.user,
        function: 'update_lead',
      },
      data.lead,
    );

    return await this.send(params);
  }

  async logout(data) {
    return await this.send({
      agent_user: data.user,
      function: 'logout',
      value: 'LOGOUT',
    })
    .then(() => this.test_logout(data))
  }

  private send(params) {
    // dialer needs this param
    params.source = 'crmexample';

    const id = Math.random().toString(32).slice(2);
    console.log(`vici.service.ts::send::126 (${id}) >>>> `, new Date(), params);

    const url = this.apiUrl + stringify(params);

    return this.httpService
      .post(url)
      .toPromise()
      .then((res) => {
        console.log(`RES (${id}) >>>> `, res.data);

        return res.data;
      });
  }
}
