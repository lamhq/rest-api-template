import serverlessExpress from '@codegenie/serverless-express';
import { Handler } from 'aws-lambda';
import { getNestApp } from './app';
import { RequestListener } from 'http';

let server: Handler | undefined;

async function bootstrap(): Promise<Handler> {
  const app = await getNestApp();
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance() as RequestListener;
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event, context, callback) => {
  server = server ?? (await bootstrap());
  await server(event, context, callback);
};
