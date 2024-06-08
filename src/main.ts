import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: "http://localhost:3001", // your Next.js frontend URL
    credentials: true // Allow credentials (cookies)
  });
  await app.listen(3000);
}
bootstrap();
