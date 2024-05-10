import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.API_PAYLOAD, // Chỉ cho phép từ nguồn gốc cụ thể
    methods: 'GET,POST', // Chỉ cho phép phương thức GET và POST
    allowedHeaders: 'Content-Type, Authorization', // Chỉ cho phép các header cụ thể
    credentials: true, // Cho phép gửi cookie hoặc thông tin xác thực
});
  await app.listen(5000);
}
bootstrap();
