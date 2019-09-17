import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { AgentService } from './services/agent.service';
import { Config } from './interfaces/config.interface';

@Controller()
export class AgentController {
  constructor(private agentService: AgentService) {}

  @Get('check-session')
  async checkSession(@Req() req) {
    return this.agentService.checkSession(req.headers.sid);
  }

  @Get('config')
  async config(@Query('initial') initial, @Query('userId') userId): Promise<Config> {
    return this.agentService.getConfig(initial === 'true', userId);
  }

  @Post('rate-call')
  async rateCall(@Body() data) {
    return await this.agentService.rateCall(data);
  }
}
