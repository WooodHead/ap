import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as crypto from 'crypto';

// FIXME move readFile to constructor, find way to use config in app.module
const config = JSON.parse(fs.readFileSync('/etc/voicespin-apps/config.json', 'utf-8'));

@Injectable()
export class ConfigService {
  static get mongoAQM() {
    return config.mongo.aqm;
  }

  static get mongoAdmin() {
    return config.mongo.admin;
  }

  static get mongoConfigs() {
    return config.mongo.configs;
  }

  static get dialerUrl() {
    return config.dialer.dialerUrl || ConfigService.mysql.host_client;
  }

  static get mysql() {
    const {
      host,
      port,
      db,
      user,
      password,
      host_client,
    } = config.mysql;

    return {
      host,
      port,
      db,
      user,
      host_client,
      password: ConfigService.decipher(password),
    };
  }

  static get mysqlPbx() {
    const {
      host,
      port,
      db,
      user,
      password,
    } = config.mysqlPbx;

    return {
      host,
      port,
      user,
      db,
      password: ConfigService.decipher(password),
    };
  }

  static get mysqlCallCenter() {
    const {
      host,
      port,
      user,
      password,
      db,
    } = config.mysqlCallCenter;

    return {
      host,
      port,
      user,
      db,
      password: ConfigService.decipher(password),
    };
  }

  static get cdr_report() {
    const {
      host,
      port,
      user,
      password,
      db,
    } = config.cdr_report;

    return {
      host,
      port,
      user,
      db,
      password: ConfigService.decipher(password),
    };
  }

  static decipher(pass) {
    const decipher = crypto.createDecipher('aes192', 'voic*pi3.14');
    const decrypted = decipher.update(pass, 'hex', 'utf8');
    return decrypted + decipher.final('utf8');
  }

  get ami() {
    const {
      astManPort: port,
      astManHost: host,
      astManUser: user,
      astManPass: pass,
    } = config.asterisk.ami;

    return {
      port,
      host,
      user,
      pass: ConfigService.decipher(pass),
    };
  }

  get agentPanelConfig() {
    return config.agentPanel || {};
  }

  get sources() {
    return config.sources;
  }

  get extensionContext() {
    return config.agent.login.context;
  }

  get webrtc() {
    return config.general.webrtc;
  }
  get port() {
    return process.env.PORT || 3000;
  }
}
