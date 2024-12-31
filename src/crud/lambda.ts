import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { getNestApp } from './app';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await getNestApp();
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
