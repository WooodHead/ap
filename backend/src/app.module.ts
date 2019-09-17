import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from 'nest-router';

import { routes } from './app.routes';

import { AppController } from './app.controller';
import { AgentModule } from './agent/agent.module';
import { ConfigService } from './common/services/config.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      ConfigService.mongoAQM,
      { connectionName: 'aqm', useNewUrlParser: true },
    ),
    MongooseModule.forRoot(
      ConfigService.mongoAdmin,
      { connectionName: 'admin', useNewUrlParser: true },
    ),
    MongooseModule.forRoot(ConfigService.mongoConfigs, { useNewUrlParser: true }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: ConfigService.mysql.host,
      port: ConfigService.mysql.port,
      username: ConfigService.mysql.user,
      password: ConfigService.mysql.password,
      database: ConfigService.mysql.db,
      entities: [`${__dirname}/agent/dialer/entities/*.entity{.ts,.js}`],
      synchronize: false,
      logging: false,
    }),

    TypeOrmModule.forRoot({
      name: 'asterisk',
      type: 'mysql',
      host: ConfigService.mysqlPbx.host,
      port: ConfigService.mysqlPbx.port,
      username: ConfigService.mysqlPbx.user,
      password: ConfigService.mysqlPbx.password,
      database: ConfigService.mysqlPbx.db,
      entities: [`${__dirname}/agent/entities/*.entity{.ts,.js}`],
      synchronize: false,
      logging: false,
    }),

    TypeOrmModule.forRoot({
      name: 'callcenter',
      type: 'mysql',
      host: ConfigService.mysqlCallCenter.host,
      port: ConfigService.mysqlCallCenter.port,
      username: ConfigService.mysqlCallCenter.user,
      password: ConfigService.mysqlCallCenter.password,
      database: ConfigService.mysqlCallCenter.db,
      entities: [`${__dirname}/agent/entities/call-center/*.entity{.ts,.js}`],
      synchronize: false,
      logging: false,
    }),

    TypeOrmModule.forRoot({
      name: 'asteriskcdrdb',
      type: 'mysql',
      host: ConfigService.cdr_report.host,
      port: ConfigService.cdr_report.port,
      username: ConfigService.cdr_report.user,
      password: ConfigService.cdr_report.password,
      database: ConfigService.cdr_report.db,
      entities: [`${__dirname}/agent/entities/dialer/*.entity{.ts,.js}`],
      synchronize: false,
      logging: false,
    }),

    RouterModule.forRoutes(routes),
    AgentModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
