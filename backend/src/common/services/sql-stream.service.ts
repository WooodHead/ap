import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';
import * as MySQLEvents from '@rodrigogs/mysql-events';
import { UtilsService } from './utils.service';

interface ITriggerConfig {
  onChange: Function,
  onConnectionError: Function,
  statement: MySQLEvents.STATEMENTS,
}
@Injectable()
export class SqlStreamService {
  private watcher: MySQLEvents;
  private connectionErrorHappend: boolean;

  private readonly dbName = 'asterisk_vici';
  private readonly reconnectionInterval = 2000;
  private readonly reconnectErrorsCode = [
    'PROTOCOL_CONNECTION_LOST',
    'PROTOCOL_PACKETS_OUT_OF_ORDER',
  ];
  private readonly asteriskViciTables = [
    'vicidial_live_agents',
    'live_sip_channels',
    'vicidial_log',
    'live_channels',
  ];

  private triggers: Map<ITriggerConfig, string> = new Map();

  constructor(private UtilsService: UtilsService) {
    this.initWatcher();
  }

  public async open(
    model: string,
    onChange: Function,
    onConnectionError: Function,
    statement: MySQLEvents.STATEMENTS = MySQLEvents.STATEMENTS.ALL,
  ) {
    try {
      if (this.watcher && this.watcher.isStarted) {
        this.addTrigger(model, { onChange, onConnectionError, statement });
      }
      this.triggers.set({ onChange, onConnectionError , statement }, model);
    } catch (err) {
      console.log('sql-stream.service.ts::open::48 >>>> ', err);
    }
  }

  private async initWatcher() {
    try {
      if (this.watcher && this.watcher.isStarted && this.watcher.zongJi) {
        await this.watcher.stop();
      }

      const config = {
        host: ConfigService.mysql.host,
        user: ConfigService.mysql.user,
        password: ConfigService.mysql.password,
      };
      this.watcher = new MySQLEvents(config, {
        startAtEnd: true,
        serverId: Math.floor(Math.random() * 100),
        includeSchema: {
          asterisk_vici: this.asteriskViciTables,
        },
      });

      await this.watcher.start();
      console.log(`[${new Date().toISOString()}] [CONNECTION SQL STREAM SERVICE] ----> CONNECTED`);

      this.watcher.on(MySQLEvents.EVENTS.CONNECTION_ERROR, async (err) => {
        if (err && err.fatal) {
          await this.disconnectHandler(err);
        }
      });
      this.watcher.on(MySQLEvents.EVENTS.ZONGJI_ERROR, async (err) => {
        if (this.reconnectErrorsCode.includes(err.code)) {
          await this.disconnectHandler(err);
        }
      });
    } catch (err) {
      await this.disconnectHandler(err);
      return;
    }

    if (this.triggers.size) {
      this.triggers.forEach((model, { onChange, onConnectionError, statement }) => {
        this.addTrigger(model, { onChange, onConnectionError, statement });
      });
    }
  }

  private addTrigger(
    model: string,
    triggerConfig: ITriggerConfig,
    watcher: MySQLEvents = this.watcher,
    ) {
    if (this.connectionErrorHappend) {
      triggerConfig.onConnectionError && triggerConfig.onConnectionError();
      watcher.removeTrigger({
        name: model,
        expression: `${this.dbName}.${model}`,
        statement: triggerConfig.statement,
      });
    }

    watcher.addTrigger({
      name: model,
      expression: `${this.dbName}.${model}`,
      statement: triggerConfig.statement,
      onEvent: (event) => {
        const row = event.affectedRows[0];

        const headerLogString = ''
          + `[${new Date(event.timestamp).toISOString()}]`
          + `[${event.table}] [${event.type}]`
          + `${event.type === 'UPDATE' ? (`[${event.affectedColumns.join(', ')}]`) : ''}`;

        // console.log(headerLogString);

        triggerConfig.onChange(row.before, row.after);
      },
    });
  }

  private async disconnectHandler(err: Error) {
    console.error(
      `[${new Date().toISOString()}] [ERROR] [CONNECTION SQL STREAM SERVICE ERROR]`,
      err,
    );

    this.connectionErrorHappend = true;
    await this.UtilsService.sleep(this.reconnectionInterval);
    this.initWatcher();
  }
}
