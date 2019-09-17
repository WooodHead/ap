import { Body, Controller, Get, Post, Query, Req, UseInterceptors } from '@nestjs/common';
import { LoginAgentDto } from './dto/login-agent.dto';
import { CallCenterService } from './services/call-center.service';
import { UtilsService } from '../../common/services/utils.service';
import { SessionInterceptor } from '../../common/services/session.interceptor';

@Controller()
export class CallCenterController {
  constructor(
    private callCenterService: CallCenterService,
    private utilsService: UtilsService,
  ) {}

  @Post('login')
  async login(@Body() data: LoginAgentDto, @Req() req) {
    // close connection for currently logged in agent on another PC
    if (data.force) {
      await this.logout(data);

      // wait 1s for sending logout for currently logged in agent
      await this.utilsService.sleep();
    }

    return await this.callCenterService.login(data, req.headers);
  }

  @Post('pause')
  async pause(@Body() data) {
    return await this.callCenterService.pause(data);
  }

  @Post('unpause')
  async unpause(@Body() query) {
    return await this.callCenterService.unpause(query);
  }

  @Post('hangup')
  async hangup(@Body() query) {
    return await this.callCenterService.hangup(query);
  }

  @Post('logout')
  async logout(@Body() data) {
    return await this.callCenterService.logout(data);
  }

  @UseInterceptors(SessionInterceptor)
  @Get('calls-history')
  callsHistory(@Req() { agent }, @Query('date-range') dateRange) {
    return this.callCenterService.getCallsHistory(agent.id, dateRange);
  }
}
