import { Context } from 'aws-lambda';
import * as Sentry from '@sentry/node';
import { AppSyncLambdaEvent } from '../utils/appsync.lambda';

Sentry.init({ dsn: process.env.SENTRY_DSN });

const sayHello = (username: string): {} => {
  return {
    name: `Hello ${username}!`,
  };
};

exports.handler = async (
  event: AppSyncLambdaEvent,
  context: Context,
): Promise<{}> => {
  context.callbackWaitsForEmptyEventLoop = false;
  let response = {};

  try {
    console.log(`Processing event ...`);
    response = sayHello(event.username);
  } catch (error) {
    Sentry.captureException(error);
  }

  return response;
};

export { sayHello };
