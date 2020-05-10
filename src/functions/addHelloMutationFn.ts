import { Context } from 'aws-lambda';
import * as Sentry from '@sentry/node';
import { AppSyncLambdaEvent } from '../utils/appsyncLambda';

Sentry.init({ dsn: process.env.SENTRY_DSN });

const addHello = (username: {}): {} => {
  return username;
};

exports.handler = async (
  event: AppSyncLambdaEvent,
  context: Context,
): Promise<{}> => {
  context.callbackWaitsForEmptyEventLoop = false;
  let response = {};

  try {
    console.log(`Processing event ...`);
    response = addHello(event.identity);
  } catch (error) {
    Sentry.captureException(error);
  }

  return response;
};

export { addHello };
