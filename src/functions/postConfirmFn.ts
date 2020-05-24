import * as CognitoISP from 'aws-sdk/clients/cognitoidentityserviceprovider';
import * as Sentry from '@sentry/node';
import * as crypto from 'crypto';
import { Context, CognitoUserPoolTriggerEvent } from 'aws-lambda';
import { captureException } from '../utils/sentryLogs';

const cognitoClient = new CognitoISP();
Sentry.init({ dsn: process.env.SENTRY_DSN });

exports.handler = async (
  event: CognitoUserPoolTriggerEvent,
  context: Context,
): Promise<CognitoUserPoolTriggerEvent> => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const userEmail = event.request.userAttributes?.email;
    const userId = crypto.createHash('md5').update(userEmail).digest('hex');

    await cognitoClient
      .adminAddUserToGroup({
        GroupName: 'BASIC',
        UserPoolId: event.userPoolId || '',
        Username: event.userName || '',
      })
      .promise();
    console.log('Added user to default group BASIC.');

    await cognitoClient
      .adminUpdateUserAttributes({
        UserPoolId: event.userPoolId || '',
        Username: event.userName || '',
        UserAttributes: [{ Name: 'custom:userId', Value: userId }],
      })
      .promise();
    console.log('Updated userId custom attribute.');
  } catch (error) {
    captureException(context, error);
  }
  return event;
};
