import { Injectable, NestInterceptor, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  constructor(@InjectModel('Session') private sessionModel: Model) {}

  private reject() {
    throw new ForbiddenException();
  }

  async intercept(context: ExecutionContext, call$: Observable<any>) {
    const request = context.getArgByIndex(0);
    const sid = request.headers.sid;

    if (sid) {
      const data = await this.sessionModel.findOne({ sid });

      if (data) {
        request.agent = { id: data.agent };
      }
    }

    if (!request.agent) this.reject();

    return call$;
  }
}
