import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';
import fs from 'fs';

async function bootstrap() {
   const devOption = process.env.NODE_ENV;

   let app;

   if (devOption === 'production') {
      const domain = process.env.CLIENT_DOMAIN ?? 'prepise.com';

      const httpsOptions = {
         key: fs.readFileSync(`/etc/letsencrypt/live/${domain}/privkey.pem`),
         cert: fs.readFileSync(`/etc/letsencrypt/live/${domain}/fullchain.pem`),
      };

      app = await NestFactory.create(AppModule, {
         httpsOptions,
      });
   } else {
      app = await NestFactory.create(AppModule);
   }

   const PORT = process.env.PORT ?? 5000;

   const corsOptions = {
      credentials: true,
      origin: process.env.CLIENT_URL,
   };

   app.useGlobalPipes(new ValidationPipe());
   app.use(cors(corsOptions));
   app.use(cookieParser(process.env.COOKIE_SECRET));

   await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}
bootstrap();
