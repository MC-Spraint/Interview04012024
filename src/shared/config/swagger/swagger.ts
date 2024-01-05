import { INestApplication } from '@nestjs/common';
import { OpenAPIObject, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function createDocument(app: INestApplication): OpenAPIObject {
  const builder = new DocumentBuilder()
    .setTitle('Interview-API')
    .setDescription('04/01/2024 [InterviewProject]');
  const options = builder.build();
  return SwaggerModule.createDocument(app, options);
}
