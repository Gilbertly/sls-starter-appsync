import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import * as Sentry from '@sentry/node';
import { Context } from 'aws-lambda';
import { AppSyncLambdaEvent } from '../utils/appsyncLambda';
import { addItem } from '../models/tableItems';

Sentry.init({ dsn: process.env.SENTRY_DSN });
const documentClient = new DynamoDB.DocumentClient();

exports.handler = async (event: AppSyncLambdaEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    console.log(`Processing event ...`);
    await addItem(documentClient, {
      tableName: process.env.TABLE_ITEMS || '',
      itemId: event.arguments.itemId || '',
      itemName: event.arguments.itemName || '',
    });
  } catch (error) {
    Sentry.captureException(error);
  }

  return event.arguments;
};
