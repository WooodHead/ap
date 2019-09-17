import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  sleep(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
