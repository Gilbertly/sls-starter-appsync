import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import * as Sentry from '@sentry/node';
import { Context } from 'aws-lambda';
import { AppSyncLambdaEvent } from '../utils/appsyncLambda';
import { captureException } from '../utils/sentryLogs';
import { getItem } from '../models/tableItems';

Sentry.init({ dsn: process.env.SENTRY_DSN });
let documentClient: DynamoDB.DocumentClient;

exports.handler = async (event: AppSyncLambdaEvent, context: Context) => {
  if (!documentClient) documentClient = new DynamoDB.DocumentClient();
  context.callbackWaitsForEmptyEventLoop = false;
  let response;

  try {
    console.log(`Processing getItem ...`);
    response = await getItem(documentClient, {
      userId: event.identity.claims['custom:userId'],
      tableName: process.env.TABLE_ITEMS || '',
      itemId: event.arguments.itemId || '',
    });
    console.log(`Successfully queried itemId: ${event.arguments.itemId}`);
  } catch (error) {
    captureException(context, error);
  }
  return response;
};
