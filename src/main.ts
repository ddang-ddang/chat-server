import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SocketIoAdapter } from './adapters/socket-io.adapters';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders: [
      'Authorization',
      'refreshToken',
      'accessToken',
      'Set-cookie',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  await app.listen(8000);
}
bootstrap();
