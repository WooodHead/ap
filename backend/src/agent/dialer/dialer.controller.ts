import { Body, Controller, Get, Param, Post, Query, Req, UseInterceptors } from '@nestjs/common';
import { LoginAgentDto } from './dto/login-agent.dto';
import { DialerService } from './services/dialer.service';
import { SessionInterceptor } from '../../common/services/session.interceptor';

@Controller()
export class DialerController {
  constructor(private dialerService: DialerService) {}

  @UseInterceptors(SessionInterceptor)
  @Get('campaigns')
  async getCampaigns(@Req() { agent }) {
    return this.dialerService.getCampaigns(agent.id);
  }

  @UseInterceptors(SessionInterceptor)
  @Get('callbacks')
  async getCallbacks(@Req() { agent }) {
    return this.dialerService.getCallbacks(agent.id);
  }

  @UseInterceptors(SessionInterceptor)
  @Get('calls-history')
  callsHistory(@Req() { agent }, @Query('date-range') dateRange) {
    return this.dialerService.getCallsHistory(agent.id, dateRange);
  }

  @UseInterceptors(SessionInterceptor)
  @Get('redial')
  async getRedial(@Req() { agent }) {
    return this.dialerService.getRedial(agent.id);
  }

  @Get('statuses')
  async getStatuses() {
    return this.dialerService.getStatuses();
  }

  @Post('login')
  async login(@Body() data: LoginAgentDto) {
    return await this.dialerService.login(data);
  }

  @UseInterceptors(SessionInterceptor)
  @Post('pause')
  async pause(@Req() { agent }, @Body() data) {
    return await this.dialerService.originate('pause', { ...data, agentId: agent.id });
  }

  @UseInterceptors(SessionInterceptor)
  @Post('unpause')
  async unpause(@Req() { agent }, @Body() data) {
    return await this.dialerService.originate('unpause', { ...data, agentId: agent.id });
  }

  @UseInterceptors(SessionInterceptor)
  @Post('hangup')
  async hangup(@Req() { agent }, @Body() data) {
    return await this.dialerService.originate('hangup', { ...data, agentId: agent.id });
  }

  @UseInterceptors(SessionInterceptor)
  @Post('status')
  async setStatus(@Req() { agent }, @Body() data) {
    return await this.dialerService.originate('setStatus', { ...data, agentId: agent.id });
  }

  @UseInterceptors(SessionInterceptor)
  @Post('callback')
  async setCallback(@Req() { agent }, @Body() data) {
    return await this.dialerService.originate('setCallback', { ...data, agentId: agent.id });
  }

  @UseInterceptors(SessionInterceptor)
  @Post('update-lead')
  async updateLead(@Req() { agent }, @Body() data) {
    return await this.dialerService.originate('updateLead', { ...data, agentId: agent.id });
  }

  @UseInterceptors(SessionInterceptor)
  @Post('dial')
  async dial(@Req() { agent }, @Body() data) {
    return await this.dialerService.originate('dial', { ...data, agentId: agent.id });
  }

  @UseInterceptors(SessionInterceptor)
  @Post('transfer')
  async transfer(@Req() { agent }, @Body() data) {
    return await this.dialerService.originate('transfer', { ...data, agentId: agent.id });
  }

  @UseInterceptors(SessionInterceptor)
  @Post('hold')
  async hold(@Req() { agent }, @Body() body) {
    return await this.dialerService.originate('hold', { body, agentId: agent.id });
  }

  @UseInterceptors(SessionInterceptor)
  @Post('logout')
  async logout(@Req() { agent }) {
    return await this.dialerService.logout(agent.id);
  }
}
