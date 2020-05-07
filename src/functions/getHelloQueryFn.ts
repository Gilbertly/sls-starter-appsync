import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import * as Sentry from '@sentry/node';
import { Context } from 'aws-lambda';
import { AppSyncLambdaEvent } from '../utils/appsyncLambda';
import { getItem } from '../models/tableItems';

Sentry.init({ dsn: process.env.SENTRY_DSN });
const documentClient = new DynamoDB.DocumentClient();

exports.handler = async (
  event: AppSyncLambdaEvent,
  context: Context,
): Promise<{}> => {
  context.callbackWaitsForEmptyEventLoop = false;
  let response = {};

  try {
    console.log(`Processing event ...`);
    response = getItem(documentClient, {
      tableName: process.env.TABLE_ITEMS || '',
      itemId: event.arguments.itemId || '',
    });
  } catch (error) {
    Sentry.captureException(error);
  }

  return response;
};
