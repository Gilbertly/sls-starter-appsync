import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import * as Sentry from '@sentry/node';
import { Context } from 'aws-lambda';
import { AppSyncLambdaEvent } from '../utils/appsyncLambda';
import { captureException } from '../utils/sentryLogs';
import { getItems } from '../models/tableItems';

Sentry.init({ dsn: process.env.SENTRY_DSN });
let documentClient: DynamoDB.DocumentClient;

exports.handler = async (event: AppSyncLambdaEvent, context: Context) => {
  if (!documentClient) documentClient = new DynamoDB.DocumentClient();
  context.callbackWaitsForEmptyEventLoop = false;
  let response;

  try {
    response = await getItems(documentClient, {
      userId: event.identity.claims['custom:userId'],
      tableName: process.env.TABLE_ITEMS || '',
      indexName: process.env.INDEX_NAME || '',
    });
    console.log(`Successfully queried items.`);
  } catch (error) {
    captureException(context, error);
  }
  return response;
};
