import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);

   const PORT = process.env.PORT ?? 5000;

   const corsOptions = {
      credentials: true,
      origin: [process.env.CLIENT_URL, 'http://localhost:3000'],
   };

   app.useGlobalPipes(new ValidationPipe());
   app.use(cors(corsOptions));
   app.use(cookieParser(process.env.COOKIE_SECRET));

   await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}

bootstrap();
