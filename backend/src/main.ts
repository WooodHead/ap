import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RealTimeDataService } from './common/services/rt-data.service';

import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useStaticAssets(join(__dirname, 'dist'));

  const rtDataService: RealTimeDataService = app.get(RealTimeDataService);
  await rtDataService.init();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
