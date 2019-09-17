import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MongoStreamService {
  private streams = {};

  constructor(
    @InjectModel('QueueMember') private queueMemberModel: Model,
    @InjectModel('Queue') private queueModel: Model,
    @InjectModel('ClientSchema') private clientModel: Model,
  ) {}

  public open(model: string, onChange: Function, field?: string) {
    try {
      this.streams[model] = this[model].watch({ fullDocument: 'updateLookup' });

      this.streams[model].on('change', (data) => {
        if (data && data.fullDocument) {
          if (
            field
            && data.updateDescription
            && data.updateDescription.updatedFields
            && typeof data.updateDescription.updatedFields[field] === undefined
          ) {
            return;
          }

          onChange(data.fullDocument);
        }
      });
    } catch (err) {
      console.log('mongo-stream.service.ts::open::18 >>>> ', err);
      // FIXME need re-open?
    }
  }

  public close(model) {
    // FIXME close watch
    // this.streams[model].close();
  }
}
