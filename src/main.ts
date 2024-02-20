import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsOptions } from './cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors(corsOptions);
    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Films API')
        .setDescription('This is the movies server API')
        .setVersion('1.0')
        .addTag('movies')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document);

    await app.listen(3000);
}
bootstrap();
