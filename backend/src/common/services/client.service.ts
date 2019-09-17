import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel('ClientSchema') private clientModel: Model,
    @InjectModel('Session') private sessionModel: Model,
  ) {}

  async removeSession(agent) {
    return await this.sessionModel.deleteOne({ agent });
  }
}
