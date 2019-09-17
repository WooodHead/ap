import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contact } from '../interfaces/contact.interface';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel('Contacts') private contactsModel: Model,
  ) {}

  async getList(agentId): Promise<Contact[]> {
    return this.contactsModel.find({ agentId }, '-__v').lean();
  }

  async create(data) {
    const contact = await this.contactsModel.create(data);

    return { _id: contact._id };
  }

  async update(data) {
    await this.contactsModel.updateOne({ _id: data._id }, data);

    return { message: 'ok' };
  }

  async delete({ _id, agentId }) {
    await this.contactsModel.deleteOne({ agentId, _id });

    return { message: 'ok' };
  }
}
