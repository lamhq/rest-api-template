import serverlessExpress from '@codegenie/serverless-express';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getNestApp } from './app';
import { RequestListener } from 'http';

let server: APIGatewayProxyHandler | undefined;

async function bootstrap(): Promise<APIGatewayProxyHandler> {
  const app = await getNestApp();
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance() as RequestListener;
  return serverlessExpress({ app: expressApp });
}

export const handler: APIGatewayProxyHandler = async (
  event,
  context,
  callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback) as Promise<APIGatewayProxyResult>;
};
