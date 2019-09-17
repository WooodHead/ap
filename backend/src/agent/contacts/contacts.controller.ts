import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ContactsService } from './services/contacts.service';
import { SessionInterceptor } from '../../common/services/session.interceptor';

@UseInterceptors(SessionInterceptor)
@Controller()
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Get()
  async getList(@Req() { agent }) {
    return this.contactsService.getList(agent.id);
  }

  @Post()
  async create(@Req() { agent }, @Body() data) {
    return this.contactsService.create({ ...data, agentId: agent.id });
  }

  @Put(':id')
  async update(@Req() { agent }, @Param('id') _id, @Body() data) {
    return this.contactsService.update({ ...data, _id, agentId: agent.id });
  }

  @Delete(':id')
  async delete(@Req() { agent }, @Param('id') _id) {
    return this.contactsService.delete({ _id, agentId: agent.id });
  }
}
