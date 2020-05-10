import * as CognitoISP from 'aws-sdk/clients/cognitoidentityserviceprovider';
import * as Sentry from '@sentry/node';
import { Context, CognitoUserPoolTriggerEvent } from 'aws-lambda';

const cognitoClient = new CognitoISP();
Sentry.init({ dsn: process.env.SENTRY_DSN });

exports.handler = async (
  event: CognitoUserPoolTriggerEvent,
  context: Context,
): Promise<{}> => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await cognitoClient
      .adminAddUserToGroup({
        GroupName: 'BASIC',
        UserPoolId: event.userPoolId || '',
        Username: event.userName || '',
      })
      .promise();
    console.log(`Added user '${event.userName}' to group 'BASIC'.`);
  } catch (error) {
    Sentry.captureException(error);
  }
  return event;
};
