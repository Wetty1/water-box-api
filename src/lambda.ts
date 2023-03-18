import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module'; // Importe o módulo principal da sua aplicação

const app = express();
const adapter = new ExpressAdapter(app);

(async function bootstrap() {
  const app = await NestFactory.create(AppModule, adapter);
  await app.init();
})();

export const handler = async (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context): Promise<AWSLambda.APIGatewayProxyResult> => {
  const { createServer, proxy } = require('aws-serverless-express');
  const binaryMimeTypes = ['application/octet-stream'];

  const server = createServer(app, null, binaryMimeTypes);
  return proxy(server, event, context);
};